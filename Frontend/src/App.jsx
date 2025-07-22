import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./component/Landing";
import Signin from "./component/Signin";
import Signup from "./component/Signup";
import NavBar from "./component/NavBar";
import Home from "./component/Home";
import Footer from "./component/Footer";
function App() {
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
