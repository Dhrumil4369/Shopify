import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError("");

  //   try {
  //     // Simulate API call - replace with your actual backend
  //     const res = await fetch(
  //       "https://shopify-backend-indol.vercel.app/api/users/login",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           email,
  //           password,
  //         }),
  //       }
  //     );

  //     const data = await res.json();

  //     if (res.ok) {
  //       // Simulate successful login
  //       const userData = {
  //         name: email.split('@')[0],
  //         email: email,
  //         role: 'customer'
  //       };
        
  //       login(data.token || "dummy-token", userData);
  //       navigate("/");
  //     } else {
  //       setError(data.message || "Login failed. Please check your credentials.");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     setError("Server error. Please try again later.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    const res = await fetch(
      "https://shopify-backend-indol.vercel.app/api/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      // Use the user data and role returned from the backend
      const userData = {
        name: data.user?.name || email.split('@')[0],     // prefer name from backend
        email: data.user?.email || email,
        role: data.user?.role || "customer",             // ← IMPORTANT: use backend role
        // you can add more fields if needed, e.g., id: data.user?._id
      };

      login(data.token || "dummy-token", userData);
      navigate("/");
    } else {
      setError(data.message || "Login failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    setError("Server error. Please try again later.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-white">Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-white">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg hover:scale-105 duration-300 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-6 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-semibold hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;