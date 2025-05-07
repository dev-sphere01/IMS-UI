import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../Services/UserService";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await UserService.login(formData);
      console.log("Login successful:", response);

      // Check if user is using an auto-generated password
      const isAutoGenPass = response.isAutoGenPass;
      console.log('Auto-generated password:', isAutoGenPass);

      // Check if user has set security questions
      const hasSecurityQuestions = response.user?.securityQuestionId1 && response.user?.securityQuestionId2;

      // Determine where to redirect the user
      if (isAutoGenPass) {
        if (!hasSecurityQuestions) {
          // If using auto-generated password and no security questions, go to security questions page
          navigate("/setSecurityQuestion");
        } else {
          // If using auto-generated password but has security questions, go to change password page
          navigate("/changePassword", { state: { isAutoGenPass: true } });
        }
      } else {
        // Regular login, go to home page
        navigate("/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-300">
      <div className="max-w-md w-full mx-auto p-6 bg-white bg-opacity-80 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-gray-500 hover:bg-gray-600"
            } text-white py-2 rounded-lg focus:outline-none`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
          <p className="text-gray-700 mt-2">
            Forgot your password?{" "}
            <a href="/forgetPassword" className="text-blue-500 hover:underline">
              Forgot Password
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
