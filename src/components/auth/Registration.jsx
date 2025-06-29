import React, { useState, useContext } from "react";
import { registerUser } from "../utils/ApiFunctions";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../auth/AuthProvider";
import { UserPlus } from "react-feather";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Registration = () => {
  const navigate = useNavigate();
  const { handleLogin, setRedirectedFromRegistration } = useContext(AuthContext);

  const [registration, setRegistration] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) =>
    setRegistration({ ...registration, [e.target.name]: e.target.value });

  const handleRegistration = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = registration;
    if (!firstName || !lastName || !email || !password) {
      return toast.error("All fields are required.");
    }
    try {
      setLoading(true);
      const { message, user } = await registerUser(registration);
      handleLogin(user.token);
      toast.success(message || "Registration successful!");
      setRegistration({ firstName: "", lastName: "", email: "", password: "" });
      navigate("/");
    } catch (error) {
      toast.error(`Registration Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    setRedirectedFromRegistration(true);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4 relative">

      {/* 🔄 Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <AiOutlineLoading3Quarters className="text-blue-600 dark:text-indigo-400" size={50} style={{ animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
        <div className="p-8 sm:p-12 lg:p-16">
          <div className="flex items-center justify-center mb-8">
            <UserPlus className="text-blue-600 dark:text-indigo-300" size={36} />
            <h2 className="ml-3 text-3xl font-bold text-black dark:text-gray-100">Sign Up</h2>
          </div>

          <form onSubmit={handleRegistration} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["firstName", "lastName"].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field === "firstName" ? "First Name" : "Last Name"}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type="text"
                    value={registration[field]}
                    onChange={handleInputChange}
                    placeholder={field === "firstName" ? "John" : "Doe"}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white text-black dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-indigo-500 transition-shadow"
                  />
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={registration.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-indigo-500 transition-shadow"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={registration.password}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-indigo-500 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-black hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-lg shadow-md transition transform hover:scale-105"
            >
              Create Account
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <span onClick={handleLoginClick} className="text-blue-600 dark:text-indigo-300 hover:underline cursor-pointer">
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
