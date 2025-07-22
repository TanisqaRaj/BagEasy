import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from 'axios';
const NavBar = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
 const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const expirytoken = async () => {
    const tokenObj = {
      token: token,
    };
    if (token) {
      axios
        .post("http://localhost:3000/auth/token-expiry", tokenObj)
        .then((response) => {
          if (response.data.success) {
            navigate("/home");
          } else {
            dispatch(logout());
            navigate("/");
          }
        });
    } else {
      return;
    }
  };
  useEffect(() => {
    expirytoken();
  }, []);

  return (
    <header className="bg-gradient-to-tr from-darkblue to-purple shadow-md w-full sticky top-0 z-[999] w-full m-0 p-0 overflow-hidden">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo Section */}
        <div className="flex items-center hidden md:block">
          <img alt="Logo" className="h-10" height={150} width={50} />
        </div>

        {/* SignIn and SignUp */}
        {/* <div className="flex items-center space-x-4">
          <a
            className="text-white hover:text-darkblue"
            onClick={() => navigate("/signin")}
          >
            Login
          </a>
          <a
            className="text-white hover:text-darkblue hidden md:block"
            onClick={() => navigate("/signup")}
          >
            SignUp
          </a>
        </div> */}
        <div className="flex items-center space-x-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="text-white hover:text-darkblue"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <a
                className="text-white hover:text-darkblue"
                onClick={() => navigate("/signin")}
              >
                Login
              </a>
              <a
                className="text-white hover:text-darkblue hidden md:block"
                onClick={() => navigate("/signup")}
              >
                SignUp
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
