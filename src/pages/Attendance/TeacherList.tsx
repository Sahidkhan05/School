import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

/* ===================== Attendance Modal ===================== */
function AttendanceModal({
  teacher,
  onClose,
  
}: {
  teacher: any;
  onClose: () => void;
  selectedClassParam?: string | null;
}) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [attendance, setAttendance] = useState<{ [day: number]: "Present" | "Absent" | "Normal" }>({});

  /* ---------- Load attendance ---------- */
  useEffect(() => {
    const raw = localStorage.getItem("attendance");
    const all = raw ? JSON.parse(raw) : {};
    const key = `${teacher.id}-${year}-${month}`;
    setAttendance(all[key] || {});
  }, [teacher, month, year]);

  /* ---------- Toggle day ---------- */
  const toggleDay = (d: number) => {
    setAttendance((prev) => {
      const cur = prev[d];
      const next =
        cur === "Present"
          ? "Absent"
          : cur === "Absent"
          ? "Normal"
          : "Present";
      return { ...prev, [d]: next };
    });
  };

  /* ---------- Save ---------- */
  const save = () => {
    const raw = localStorage.getItem("attendance");
    const all = raw ? JSON.parse(raw) : {};
    const key = `${teacher.id}-${year}-${month}`;
    all[key] = attendance;
    localStorage.setItem("attendance", JSON.stringify(all));
    onClose();
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  /* ---------- Weekday logic ---------- */
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const firstDay = new Date(year, month, 1).getDay(); // Sun=0
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon start

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-[440px] rounded-xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {teacher.name}
            </h3>
            <p className="text-sm text-gray-500">Monthly Attendance</p>
          </div>
          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Month / Year */}
        <div className="flex gap-3 px-5 py-4">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-1/2 border rounded-lg px-3 py-2"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-1/2 border rounded-lg px-3 py-2"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <option key={i} value={today.getFullYear() - i}>
                {today.getFullYear() - i}
              </option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-sm mb-2">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-500 rounded"></span> Present
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500 rounded"></span> Absent
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-gray-300 rounded"></span> Leave
          </span>
        </div>

        {/* Calendar */}
        <div className="px-5 py-4">
          {/* Weekday header */}
          <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 mb-2">
            {weekDays.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const s = attendance[d];

              return (
                <div
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`h-10 flex items-center justify-center rounded-lg cursor-pointer font-medium transition
                    ${
                      s === "Present"
                        ? "bg-green-500 text-white"
                        : s === "Absent"
                        ? "bg-red-500 text-white"
                        : s === "Normal"
                        ? "bg-gray-300"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== Teacher List ===================== */
export default function TeacherList() {
  const { classId, className } = useParams<{ classId?: string; className?: string }>();
  const classParam = classId ?? className ?? null;

  const [search, setSearch] = useState("");
  const [allTeachers, setAllTeachers] = useState<any[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [, setRefresh] = useState(0);

  useEffect(() => {
    fetch("https://school-bos-backend.onrender.com/Account/teachers/")
      .then((r) => r.json())
      .then((data) => {
        setAllTeachers(
          data.map((t: any) => ({
            id: t.id,
            name: t.teacher_name || t.name,
            staffId: t.staff_id,
            classes: t.class_teacher_of || "",
          }))
        );
      });
  }, []);

  const filteredTeachers = allTeachers.filter(
    (t) =>
      (!classParam || String(t.classes).includes(String(classParam))) &&
      t.name.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <main className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Teachers Attendance
          </h1>
          <input
            className="border px-4 py-2 rounded-lg w-64"
            placeholder="Search teacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Staff ID</th>
                <th className="p-3 text-center">Attendance %</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((t, i) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-medium">{t.name}</td>
                  <td className="p-3">{t.staffId}</td>
                  <td className="p-3 text-center font-semibold">
                    {getAttendancePercent(t.id)}%
                  </td>
                  <td className="p-3 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => markToday(t.id, "Present")}
                      className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Present
                    </button>
                    <button
                      onClick={() => markToday(t.id, "Absent")}
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => setSelectedTeacher(t)}
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Mark
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTeacher && (
        <AttendanceModal
          teacher={selectedTeacher}
          selectedClassParam={classParam}
          onClose={() => setSelectedTeacher(null)}
        />
      )}
    </main>
  );
}
