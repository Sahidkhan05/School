import { useState } from "react";
import { FaUserCircle, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { MdOutlineClass } from "react-icons/md";

export default function Dashboard() {
  const [profileOpen, setProfileOpen] = useState(false);

  const stats = [
    {
      title: "Total Students",
      value: "1064",
      subtitle: "Active students this year",
      icon: <FaUserGraduate className="text-blue-600 text-2xl" />,
    },
    {
      title: "Teacher",
      value: "32",
      subtitle: "Active teaching staff",
      icon: <FaChalkboardTeacher className="text-green-600 text-2xl" />,
    },
    {
      title: "Classes",
      value: "62",
      subtitle: "Active Classes",
      icon: <MdOutlineClass className="text-purple-600 text-2xl" />,
    },
    {
      title: "Attendance",
      value: "912 / 1064",
      subtitle: "Active students",
      icon: <BsFillPersonLinesFill className="text-orange-600 text-2xl" />,
    },
  ];

  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* Profile button top-right */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center focus:outline-none"
            aria-expanded={profileOpen}
            aria-label="User profile"
          >
            <FaUserCircle
              size={profileOpen ? 56 : 30}
              className="text-gray-700 transition-all duration-300"
            />
          </button>

          <div className={`${profileOpen ? "block" : "hidden"}`}>
            <div className="font-medium">XYZ</div>
            <div className="text-sm text-gray-500">xyz@gmail.com</div>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-gray-600">Welcome to student management system</p>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-700 font-semibold">{item.title}</h3>
              {item.icon}
            </div>
            <div className="text-3xl font-bold text-gray-900">{item.value}</div>
            <p className="text-sm text-gray-500">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
