import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./component/Landing";
import Signin from "./component/Signin";
import Signup from "./component/Signup";
import NavBar from "./component/NavBar";
import Home from "./component/Home";
import Footer from "./component/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { logout } from "./component/redux/AuthSlice";
function App() {
  const dispatch = useDispatch();
  const expiresIn = useSelector((state) => state.auth.expiresIn);
  useEffect(() => {
    console.log("Expiry time from store:", expiresIn);
    if (expiresIn == null || (expiresIn != null && Date.now() >= expiresIn)) {
      dispatch(logout());
    }
  }, []);
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <NavBar />
          <Landing />
          <Footer />
        </div>
      ),
    },
    {
      path: "/signin",
      element: (
        <div>
          <NavBar />
          <Signin />
          <Footer />
        </div>
      ),
    },
    {
      path: "/signup",
      element: (
        <div>
          <NavBar />
          <Signup />
          <Footer />
        </div>
      ),
    },
    {
      path: "/home",
      element: (
        <div>
          <NavBar />
          <Home />
          <Footer />
        </div>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
