import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(dispatch, { email, password });

      // Check if result is defined and successful
      if (result) {
        console.log("Login successful:", result); // For debugging
        // toast.success("Login successful!"); // Show success toast
        alert("Login successful")
      }
    } catch (error) {
      console.error("Login error:", error); // Log error for debugging
      if (error.message) {
        toast.error(error.message); // Show the error message from the server
      } else {
        toast.error("Incorrect email or password!"); // Default error message
      }
    } finally {
      setLoading(false);
    }
  };



  // Redirect to home page if already logged in
  if (user.currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center mt-[5%]">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex items-center bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="h-[500px] w-[500px] transition-transform duration-700 ease-in-out transform hover:scale-105">
          <img
            src="/lotion1.jpg"
            alt="Login"
            className="object-cover h-full w-full"
          />
        </div>
        <div className="p-10 w-[500px]">
          <h2 className="text-xl font-bold text-gray-700 mb-5">Login</h2>
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d55fbb]"
                placeholder="example@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d55fbb]"
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#d55fbb] text-white font-bold rounded-md transition-transform duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:scale-105"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
          <div className="mt-4 text-sm text-gray-600">
            <span>Don't have an account? </span>
            <Link to="/create-account" className="text-red-500 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
