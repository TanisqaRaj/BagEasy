import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { login } from "./redux/AuthSlice";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useDispatch();
  const token=useSelector((state)=>state.auth.token);
  console.log(token);
  const navigate = useNavigate();
  const navigateRegister = () => {
    navigate("/signup");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://bageasy-backend.onrender.com/auth/login", { email, password })
      .then((result) => {
        console.log(result);
        if (result.data.success === true) {
         dispatch(
          login({
            token:result.data.token,
            user:result.data.user,
          })
         )
          navigate("/home");
        } else {
          navigate("/signup");
        }
      })
      .catch((err) => console.log(err));
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
          className="bg-purple hover:bg-darkblue text-white font-semibold py-2 sm:py-3 px-4 rounded-md w-full transition duration-200"
        >
          Sign In
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
