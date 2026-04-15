import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { login } from "./redux/AuthSlice";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const token=useSelector((state)=>state.auth.token);
  console.log(token);
  const navigate = useNavigate();
  const navigateRegister = () => {
    navigate("/signup");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    axios
      .post("https://bageasy-backend.onrender.com/auth/login", { email, password })
      .then((result) => {
        if (result.data.success === true) {
          dispatch(
            login({
              token: result.data.token,
              user: result.data.user,
              expiresIn: result.data.expiresIn,
            })
          );
          navigate("/home");
        } else {
          setError("Login failed. Please try again.");
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message;
        if (msg === "user not found") setError("No account found with this email.");
        else if (msg === "wrong password") setError("Incorrect password. Please try again.");
        else setError("Something went wrong. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
  <div className="min-h-screen bg-darkblue flex items-center justify-center w-full p-4 sm:p-6">
  <div className="bg-lightblue p-6 sm:p-10 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg">
    {/* Title */}
    <div className="flex items-center justify-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-purple mb-6 text-center">
        Sign in
      </h2>
    </div>

    {/* Form */}
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 text-sm px-4 py-2 rounded-md">
          {error}
        </div>
      )}
      {/* Email Input */}
      <div>
        <label
          className="block text-gray-700 text-xs sm:text-sm font-medium mb-1"
          htmlFor="email"
        >
          <span className="block sm:hidden">Username</span>
          <span className="hidden sm:block">
            Email
          </span>
        </label>
        <input
          className="text-sm sm:text-base shadow-sm border border-gray-300 rounded-md w-full py-2 sm:py-3 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email, Phone, or Username"
        />
      </div>

      {/* Password Input */}
      <div>
        <label
          className="block text-gray-700 text-xs sm:text-sm font-medium mb-1"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="text-sm sm:text-base shadow-sm border border-gray-300 rounded-md w-full py-2 sm:py-3 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="bg-purple hover:bg-darkblue text-white font-semibold py-2 sm:py-3 px-4 rounded-md w-full transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>

      {/* SignUp Link */}
      <div
        className="flex justify-center items-center space-x-1 mt-2 cursor-pointer"
        onClick={navigateRegister}
      >
        <p className="text-xs sm:text-sm text-gray-600">
          Don’t have an account?
        </p>
        <p className="text-xs sm:text-sm text-purple font-medium">Signup</p>
      </div>
    </form>
  </div>
</div>

  );
};

export default Signin;
