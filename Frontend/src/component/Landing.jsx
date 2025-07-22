import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="font-sans w-full m-0 p-0 overflow-hidden">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-tr from-darkblue via-lightblue to-purple text-white min-h-screen flex flex-col justify-center items-center px-6"
        data-aos="fade-up"
      >
        <h1 className="text-5xl font-bold mb-4 text-center">
          Smart Bag Management System
        </h1>
      </section>
    </div>
  );
};
export default Landing;
