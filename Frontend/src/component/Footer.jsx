import React from "react";
import { FaInstagram } from "react-icons/fa6";
import { ImWhatsapp } from "react-icons/im";
import { TbBrandTelegram } from "react-icons/tb";
import { LiaFacebook } from "react-icons/lia";
import { TbBrandTwitter } from "react-icons/tb";
import { FaRegCopyright } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="shadow-md bg-gradient-to-tr from-purple to-darkblue w-full m-0 p-0 overflow-hidden">
  {/* Social Icons */}
  <div className="container mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 px-4 py-5 text-xl sm:text-2xl">
    <FaInstagram />
    <ImWhatsapp />
    <TbBrandTelegram />
    <LiaFacebook />
    <TbBrandTwitter />
  </div>

  {/* Copyright */}
  <div className="flex flex-wrap gap-1 items-center justify-center mt-1 text-[10px] sm:text-xs lg:text-sm text-white">
    <FaRegCopyright />
    <span>2024 Healthcare. All rights reserved.</span>
  </div>
</footer>

  );
};

export default Footer;
