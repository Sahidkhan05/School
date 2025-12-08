import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EditProfileModal from "./EditProfileModal";
import LogoutConfirmModal from "./LogoutConfirmModal";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  // 🟦 Sidebar jaisa localStorage se data lo
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");

  const [open, setOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 🟩 Dynamic user data
  const [user, setUser] = useState({
    name: userName || "Unknown User",
    email: userEmail || "example@gmail.com",
    avatar: "/images/Navonous_Logo.png"
  });

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Small Profile Icon */}
      <img
        src={user.avatar}
        alt="Profile"
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 hover:border-gray-500 transition"
      />

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-2xl p-4 border border-gray-200"
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={user.avatar}
                alt="Profile Large"
                className="w-20 h-20 rounded-full mb-2 border border-gray-300"
              />
              <h2 className="font-semibold text-lg">{user.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{user.email}</p>

              {/* Buttons */}
              <div className="w-full flex flex-col gap-2">
                <button
                  onClick={() => {
                    setShowEditModal(true);
                    setOpen(false);
                  }}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg transition"
                >
                  ✏️ Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg transition"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <EditProfileModal
            user={user}
            setUser={setUser}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <LogoutConfirmModal
            onCancel={() => setShowLogoutConfirm(false)}
            onConfirm={confirmLogout}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
