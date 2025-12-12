import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/api";

interface Teacher {
  id: number;
  name: string;
  department?: string;
  contact?: string;
}

interface SalaryRecord {
  teacherId: number;
  month: string;
  year: number;
  basicSalary: number;
  allowance: number;
  deduction: number;
  finalSalary: number;
  createdAt: string;
}

export default function TeacherPayrollPage() {
  const { id } = useParams<{ id: string }>();

  const [teacher, setTeacher] = useState<Teacher | null>(null);

  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [basicSalary, setBasicSalary] = useState<number | "">("");
  const [allowance, setAllowance] = useState<number | "">("");
  const [deduction, setDeduction] = useState<number | "">("");
  const [finalSalary, setFinalSalary] = useState(0);

  // Auto-calc final salary
  useEffect(() => {
    const basic = Number(basicSalary) || 0;
    const allow = Number(allowance) || 0;
    const ded = Number(deduction) || 0;

    setFinalSalary(basic + allow - ded);
  }, [basicSalary, allowance, deduction]);

  // Fetch teacher from localStorage or backend
 useEffect(() => {
  async function fetchTeacher() {
    try {
      // Use centralized API_ENDPOINTS to avoid hard-coded path / 404
      const teacherUrl = `${API_ENDPOINTS.account.teachers}${id}/`;
      const res = await fetch(teacherUrl);

      if (res.ok) {
        const data = await res.json();
        setTeacher({
          id: Number(data.id),
          name: data.name,
          department: data.department,
          contact: data.contact
        });
        return;
      }

      // Non-ok (including 404) → fallback to localStorage without noisy console error
      const storedTeachers = JSON.parse(localStorage.getItem("teachers") || "[]");
      const found = storedTeachers.find((t: any) => String(t.id) === String(id));
      setTeacher(found || null);

    } catch (error) {
      // On network error fallback to localStorage
      const storedTeachers = JSON.parse(localStorage.getItem("teachers") || "[]");
      const found = storedTeachers.find((t: any) => String(t.id) === String(id));
      setTeacher(found || null);
    }
  }

  fetchTeacher();
}, [id]);


  const handleSave = () => {
    if (!month) return alert("Please select a month");

    const newRecord: SalaryRecord = {
      teacherId: Number(id),
      month,
      year,
      basicSalary: Number(basicSalary),
      allowance: Number(allowance),
      deduction: Number(deduction),
      finalSalary,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("payroll") || "[]");
    existing.push(newRecord);

    localStorage.setItem("payroll", JSON.stringify(existing));

    alert("Salary Saved Successfully ✔");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const msg = `
Salary Slip
----------------------
Teacher: ${teacher?.name}
Month: ${month} ${year}
Final Salary: ₹${finalSalary}
    `;

    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Teacher Payroll
      </h2>

      {teacher ? (
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">{teacher.name}</h3>
          <p className="text-gray-600 mb-4">
            Department: {teacher.department || "N/A"}
          </p>

          {/* Salary Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block mb-1 font-semibold">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Month</option>
                {[
                  "January","February","March","April","May","June",
                  "July","August","September","October","November","December",
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Basic Salary</label>
              <input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Allowance</label>
              <input
                type="number"
                value={allowance}
                onChange={(e) => setAllowance(Number(e.target.value))}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Deduction</label>
              <input
                type="number"
                value={deduction}
                onChange={(e) => setDeduction(Number(e.target.value))}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Final Salary</label>
              <input
                type="text"
                readOnly
                value={finalSalary}
                className="border p-2 rounded w-full bg-gray-100"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4 flex-wrap">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save Salary
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Print Slip
            </button>

            <button
              onClick={handleWhatsApp}
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              WhatsApp Slip
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Teacher not found...</p>
      )}
    </div>
  );
}
