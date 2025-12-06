import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../config";

interface LoginFormProps {
  setIsLoggedIn: (value: boolean) => void;
}

function LoginForm({ setIsLoggedIn }: LoginFormProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { email, password };

    try {
      // FINAL API CALL
      const res = await fetch(`${BASE_URL}/Account/login/`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: any = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        console.warn("Non-JSON login response:", text);
      }

      if (!res.ok) {
        let msg = "Login failed.";

        if (data.detail) msg = data.detail;
        else if (data.message) msg = data.message;
        else if (typeof data === "object") {
          msg = Object.entries(data)
            .map(([k, v]: any) =>
              Array.isArray(v) ? `${k}: ${v.join(", ")}` : `${k}: ${v}`
            )
            .join(" | ");
        } else if (text) msg = text;

        alert(msg);
        setLoading(false);
        return;
      }

      const { access, refresh, role, username } = data;

      if (!access || !refresh) {
        alert("Login succeeded but tokens missing.");
        setLoading(false);
        return;
      }

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userRole", role || "student");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("username", username || email);

      setIsLoggedIn(true);

      if (role === "admin") navigate("/");
      else if (role === "teacher") navigate("/teacher");
      else navigate("/");

    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="relative w-1/2 bg-white flex items-center justify-center">
        <div className="absolute top-0 left-0 p-6">
          <img src="/images/Navonous_Logo.png" alt="Navonous Logo" className="h-auto w-32" />
        </div>
        <img className="h-auto max-w-full" src="/images/Welcome_Back.png" alt="Welcome Image" />
      </div>

      {/* Right Side */}
      <div className="relative w-1/2 bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md px-8 py-12">
          <h2 className="text-3xl font-bold mb-8">Welcome Back</h2>

          <form onSubmit={handleLogin}>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
              type="email"
              required
            />

            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
              type="password"
              required
            />

            <div className="flex items-center mb-6">
              <Link to="/forgetpassword" className="text-gray-600 text-sm">
                Forget Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 rounded-lg text-lg font-semibold mb-4 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-900 underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
