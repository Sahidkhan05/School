import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

export default function TeacherPayrollHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("payroll") || "[]");
    const teacherRecords = all.filter((item: SalaryRecord) => item.teacherId === Number(id));
    setRecords(teacherRecords);
  }, [id]);

  const filtered = records.filter((r) => {
    return (
      (filterMonth === "" || r.month === filterMonth) &&
      (filterYear === "" || String(r.year) === filterYear)
    );
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Back Button */}
      {/* Back Button - Top Right */}
<div className="flex justify-end mb-4">
  <button
    onClick={() => navigate(-1)}
    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
  >
    ← Back
  </button>
</div>

      <h2 className="text-2xl font-bold mb-4 text-blue-700">Salary History</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Months</option>
          {[
            "January","February","March","April","May","June",
            "July","August","September","October","November","December",
          ].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <input
          type="number"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          placeholder="Year"
          className="border p-2 rounded w-32"
        />
      </div>

      {/* History Table */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 italic">No salary records found.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Year</th>
              <th className="p-2 border">Basic</th>
              <th className="p-2 border">Allowance</th>
              <th className="p-2 border">Deduction</th>
              <th className="p-2 border">Final</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 border">{r.month}</td>
                <td className="p-2 border">{r.year}</td>
                <td className="p-2 border">₹{r.basicSalary}</td>
                <td className="p-2 border">₹{r.allowance}</td>
                <td className="p-2 border">₹{r.deduction}</td>
                <td className="p-2 border font-bold">₹{r.finalSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}
