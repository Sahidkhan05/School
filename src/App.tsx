// import SignupForm from "./pages/Signup";
// import LoginForm from "./pages/login";
// import ForgetPassword from "./pages/ForgetPassword";
// import ResetPassword from "./pages/ResetPassword";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <Dashboard />
    </div>
    
  );
}

export default App;
