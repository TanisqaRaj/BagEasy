import React, { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import {
  FaBrain,
  FaListCheck,
  FaStar,
  FaShieldHalved,
  FaBolt,
  FaGlobe,
  FaArrowRight,
  FaBagShopping,
} from "react-icons/fa6";

/* ─── Floating orb background ─────────────────────────────────────────────── */
const Orb = ({ className }) => (
  <div className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`} />
);

/* ─── Feature card ─────────────────────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <div
    data-aos="fade-up"
    data-aos-delay={delay}
    className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md
               hover:bg-white/10 hover:border-purple/50 hover:shadow-[0_0_30px_rgba(154,85,243,0.15)]
               transition-all duration-500 cursor-default"
  >
    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl
                    bg-gradient-to-br from-purple/30 to-lightblue/30 border border-white/10
                    group-hover:scale-110 transition-transform duration-300">
      <Icon className="text-purple text-xl" />
    </div>
    <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

/* ─── Stat pill ────────────────────────────────────────────────────────────── */
const Stat = ({ value, label, delay }) => (
  <div
    data-aos="zoom-in"
    data-aos-delay={delay}
    className="flex flex-col items-center px-8 py-5 rounded-2xl border border-white/10
               bg-white/5 backdrop-blur-md"
  >
    <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple to-lightblue
                     bg-clip-text text-transparent">
      {value}
    </span>
    <span className="text-gray-400 text-sm mt-1">{label}</span>
  </div>
);

/* ─── Main component ───────────────────────────────────────────────────────── */
const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });
  }, []);

  const features = [
    { icon: FaBrain,        title: "AI-Powered Suggestions",   desc: "Get smart packing recommendations tailored to your destination, weather, and trip type.", delay: 0   },
    { icon: FaListCheck,    title: "Smart Checklists",          desc: "Never forget an item again. Dynamic checklists that adapt to your travel style.",          delay: 100 },
    { icon: FaStar,         title: "Personalized Experience",   desc: "The more you use it, the smarter it gets — learning your preferences over time.",          delay: 200 },
    { icon: FaShieldHalved, title: "Secure & Private",          desc: "Your travel data stays yours. End-to-end encryption keeps everything safe.",               delay: 300 },
    { icon: FaBolt,         title: "Lightning Fast",            desc: "Instant suggestions and real-time updates so you can pack and go without delays.",          delay: 400 },
    { icon: FaGlobe,        title: "Travel Anywhere",           desc: "Supports international trips with region-specific packing guides and customs tips.",         delay: 500 },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] font-sans overflow-x-hidden">

      {/* ── Background orbs ── */}
      <Orb className="w-[600px] h-[600px] bg-purple top-[-200px] left-[-200px]" />
      <Orb className="w-[500px] h-[500px] bg-lightblue top-[30%] right-[-150px]" />
      <Orb className="w-[400px] h-[400px] bg-midnight bottom-[10%] left-[20%]" />


      {/* HERO */}

      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 text-center">

        {/* Badge */}
        <div
          data-aos="fade-down"
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                     border border-purple/40 bg-purple/10 backdrop-blur-sm text-purple text-sm font-medium"
        >
          <FaBagShopping className="text-xs" />
          AI-Powered Travel Assistant
        </div>

        {/* Headline */}
        <h1
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight
                     bg-gradient-to-br from-white via-gray-200 to-gray-400 bg-clip-text text-transparent
                     max-w-4xl"
        >
          Smart Bag
          <span className="block bg-gradient-to-r from-purple to-lightblue bg-clip-text text-transparent">
            Management System
          </span>
        </h1>

        {/* Sub-headline */}
        <p
          data-aos="fade-up"
          data-aos-delay="200"
          className="mt-6 text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          Travel smarter with AI-powered packing suggestions, checklists, and
          personalized recommendations — all in one place.
        </p>

        {/* CTA buttons */}
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center"
        >
          <button
            onClick={() => navigate("/signup")}
            className="group flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-purple to-lightblue
                       hover:shadow-[0_0_30px_rgba(154,85,243,0.5)] hover:scale-105
                       transition-all duration-300"
          >
            Get Started Free
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button
            onClick={() => navigate("/signin")}
            className="px-8 py-3.5 rounded-xl font-semibold text-white border border-white/20
                       bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/40
                       transition-all duration-300"
          >
            Sign In
          </button>
        </div>
      </section>


      {/* STATS */}
  
      <section className="relative px-4 sm:px-6 lg:px-12 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat value="50K+"  label="Happy Travelers"    delay={0}   />
          <Stat value="99%"   label="Packing Accuracy"   delay={100} />
          <Stat value="200+"  label="Destinations"       delay={200} />
          <Stat value="4.9★"  label="Average Rating"     delay={300} />
        </div>
      </section>


      {/* FEATURES */}

      <section className="relative px-4 sm:px-6 lg:px-12 py-20">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14" data-aos="fade-up">
            <span className="text-purple text-sm font-semibold tracking-widest uppercase">Features</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
              Everything you need to pack perfectly
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
              From AI suggestions to smart checklists, we've got every corner of your trip covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
 
      <section className="relative px-4 sm:px-6 lg:px-12 py-20">
        <div
          data-aos="fade-up"
          className="max-w-4xl mx-auto rounded-3xl border border-white/10
                     bg-gradient-to-br from-purple/20 via-white/5 to-lightblue/10
                     backdrop-blur-md p-10 sm:p-16 text-center
                     shadow-[0_0_80px_rgba(154,85,243,0.1)]"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to travel smarter?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join thousands of travelers who pack with confidence using our AI-powered system.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-purple to-lightblue
                       hover:shadow-[0_0_40px_rgba(154,85,243,0.5)] hover:scale-105
                       transition-all duration-300"
          >
            Start for Free
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </section>

    </div>
  );
};

export default Landing;
