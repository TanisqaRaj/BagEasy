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
        className="bg-gradient-to-tr from-darkblue via-lightblue to-purple text-white min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12"
        data-aos="fade-up"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center leading-snug">
          Smart Bag Management System
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center max-w-2xl mt-2 opacity-90">
          Travel smarter with AI-powered packing suggestions, checklists, and
          personalized recommendations.
        </p>
      </section>
    </div>
  );
};
export default Landing;
