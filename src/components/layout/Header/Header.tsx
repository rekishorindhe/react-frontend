import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../context/AuthContext";

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="p-4 flex justify-between items-center shadow-md">
      {/* Logo / Brand */}
      <h1
        className="text-2xl font-bold cursor-pointer text-gray-800 hover:text-gray-600"
        onClick={() => navigate("/")}
      >
        My App
      </h1>

      {/* Navigation Links */}
      <div className="flex gap-4">
        {isAuthenticated ? (
          <>
            <span
              className="px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer hover:bg-red-500 transition"
              onClick={handleLogout}
            >
              Logout
            </span>
          </>
        ) : (
          <>
            <span
              className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-500 transition"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </span>
            <span
              className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-500 transition"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
            <span
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md cursor-pointer hover:bg-gray-300 transition"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
            <span
              className="px-4 py-2 bg-green-600 text-white rounded-md cursor-pointer hover:bg-green-500 transition"
              onClick={() => navigate("/formik")}
            >
              SignUp Formik
            </span>
            <span
              className="px-4 py-2 bg-green-600 text-white rounded-md cursor-pointer hover:bg-green-500 transition"
              onClick={() => navigate("/form")}
            >
              Form With Rich Textbox and upload
            </span>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
