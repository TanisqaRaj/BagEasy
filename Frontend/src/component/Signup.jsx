import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const navigateRegister = () => {
    navigate("/signin");
  };

  const handleSubmit = () => {
    axios
      .post("https://bageasy-backend.onrender.com/auth/register/user", {
        name,
        email,
        password,
      })
      .then((result) => {
        console.log(result);
        navigate("/signin");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="min-h-screen w-full m-0 p-0 overflow-hidden bg-darkblue flex items-center justify-center">
        <div className="bg-lightblue p-6 sm:p-10 rounded-xl shadow-lg w-full max-w-lg mx-auto">
          <div className="flex items-center justify-center">
            <h2 className="text-2xl sm:text-4xl font-semibold text-purple mb-6">
              Sign up
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 sm:py-3 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                id="name"
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>

            {/* Identifier Input */}
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="email"
              >
                <span className="block sm:hidden">Username</span>
                <span className="hidden sm:block">
                  Email or Phone Number or Username
                </span>
              </label>
              <input
                className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 sm:py-3 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                id="identifier"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or Phone Number or Username"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 sm:py-3 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
                className="bg-purple hover:bg-darkblue text-white font-semibold py-2 px-4 rounded-md w-full transition duration-200"
              >
                Sign up
              </button>
            </div>

            {/* SignUp */}
            <div
              className="flex justify-center items-center space-x-1 cursor-pointer"
              onClick={navigateRegister}
            >
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?
              </p>
              <p className="text-sm text-purple font-medium">Signin</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
