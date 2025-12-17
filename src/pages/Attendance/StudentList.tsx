import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AttendanceModal } from "./TeacherList";

// ✅ StudentList component with total attendance, Excel & PDF export
export default function StudentList() {
  const params = useParams<{ classId?: string; className?: string }>();
  const rawClassParam = params.classId ?? params.className ?? null;
  const [resolvedClassId, setResolvedClassId] = useState<string | null>(null);
  const [resolvedLabel, setResolvedLabel] = useState<string | null>(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [, setRefresh] = useState(0);

  const getAttendancePercent = (id: number) => {
    const raw = localStorage.getItem("attendance");
    if (!raw) return 0;
    const all = JSON.parse(raw);

    let total = 0;
    let present = 0;

    Object.keys(all)
      .filter((k) => k.startsWith(`${id}-`))
      .forEach((k) => {
        Object.values(all[k]).forEach((v: any) => {
          if (v !== "Normal") {
            total++;
            if (v === "Present") present++;
          }
        });
      });

    return total ? Math.round((present / total) * 100) : 0;
  };

  const markToday = (id: number, status: "Present" | "Absent") => {
    const d = new Date();
    const key = `${id}-${d.getFullYear()}-${d.getMonth()}`;
    const raw = localStorage.getItem("attendance");
    const all = raw ? JSON.parse(raw) : {};
    all[key] = { ...(all[key] || {}), [d.getDate()]: status };
    localStorage.setItem("attendance", JSON.stringify(all));
    setRefresh(Date.now());
  };

  // Fetch students for the class from backend
  useEffect(() => {
    let mounted = true;
    const resolveAndFetch = async () => {
      if (!rawClassParam) return setAllStudents([]);

      // If rawClassParam is numeric, use directly as class id
      let classIdToUse: string | null = null;
      if (/^\d+$/.test(String(rawClassParam))) {
        classIdToUse = String(rawClassParam);
      } else {
        // Try to find class by name/label from classes list
        try {
          const res = await fetch("https://school-bos-backend.onrender.com/schoolApp/classes/");
          const classes = await res.json();
          const decoded = decodeURIComponent(String(rawClassParam));
          const found = classes.find((c: any) => {
            const label = c.section ? `${c.class_name} - ${c.section}` : c.class_name;
            return (
              c.class_name === decoded ||
              String(c.id) === decoded ||
              label === decoded ||
              label === rawClassParam
            );
          });
          if (found) classIdToUse = String(found.id);
        } catch (e) {
          // ignore and fallthrough
        }
      }

      if (!classIdToUse) {
        // can't resolve class id
        if (mounted) setAllStudents([]);
        setResolvedClassId(null);
        setResolvedLabel(rawClassParam ? String(rawClassParam) : null);
        return;
      }

      try {
        const r = await fetch(`https://school-bos-backend.onrender.com/schoolApp/class/${classIdToUse}/students/`);
        const data = await r.json();
        if (!mounted) return;
        if (Array.isArray(data)) {
          const mapped = data.map((s: any) => ({
            id: s.id,
            name: s.name,
            enrollmentNo: s.enrollmentNo || s.enrollment_no || s.enrollmentNo,
            fatherName: s.parent_name || s.fatherName || s.parentName || '',
            parent_contact: s.parent_contact || s.parentContact || '',
            class: s.class || s.class_name || '',
            section: s.section || '',
          }));
          setAllStudents(mapped);
          setResolvedClassId(classIdToUse);
          // derive a label for header
          setResolvedLabel(`${mapped.length && mapped[0].class ? mapped[0].class : ''}` || String(rawClassParam));
        } else {
          setAllStudents([]);
        }
      } catch (err) {
        if (mounted) setAllStudents([]);
      }
    };

    resolveAndFetch();
    return () => {
      mounted = false;
    };
  }, [rawClassParam]);

  const filteredStudents = allStudents.filter((stu) =>
    (stu.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (stu.enrollmentNo || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded"
              aria-label="Back"
            >
              ←
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">
              Students Attendance
            </h1>
            {resolvedLabel && (
              <div className="text-sm text-gray-600">{resolvedLabel}</div>
            )}
          </div>
          <input
            className="border px-4 py-2 rounded-lg w-64"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Father’s Name</th>
                <th className="p-3">Class</th>
                <th className="p-3">Section</th>
                <th className="p-3">Enrollment No</th>
                <th className="p-3 text-center">Attendance %</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((stu, index) => (
                <tr key={stu.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{stu.name}</td>
                  <td className="p-3">{stu.fatherName}</td>
                  <td className="p-3">{stu.class}</td>
                  <td className="p-3">{stu.section}</td>
                  <td className="p-3">{stu.enrollmentNo}</td>
                  <td
                    className={`p-3 text-center font-semibold ${
                      getAttendancePercent(stu.id) >= 75
                        ? "text-green-600"
                        : getAttendancePercent(stu.id) >= 50
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {getAttendancePercent(stu.id)}%
                  </td>

                  <td className="p-3 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => markToday(stu.id, "Present")}
                      className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Present
                    </button>
                    <button
                      onClick={() => markToday(stu.id, "Absent")}
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => setSelectedStudent(stu)}
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Mark
                    </button>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-6 text-gray-500">
                    No students found for this class.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <AttendanceModal
          teacher={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </main>
  );
}



