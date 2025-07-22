import React from "react";
import { FaInstagram } from "react-icons/fa6";
import { ImWhatsapp } from "react-icons/im";
import { TbBrandTelegram } from "react-icons/tb";
import { LiaFacebook } from "react-icons/lia";
import { TbBrandTwitter } from "react-icons/tb";
import { FaRegCopyright } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="shadow-md bg-gradient-to-tr from-purple to-darkblue flex-col pb-4 w-full m-0 p-0 overflow-hidden">
      <div className="container mx-auto flex items-center justify-center px-4 py-5 space-x-10 text-2xl">
        <div>
          <FaInstagram />
        </div>
        <div>
          <ImWhatsapp />
        </div>
        <div>
          <TbBrandTelegram />
        </div>
        <div>
          <LiaFacebook />
        </div>
        <div>
          <TbBrandTwitter />
        </div>
      </div>
      <div className="flex gap-x-1 items-center justify-center mt-1  text-xs lg:text-sm">
        <FaRegCopyright />
        <div>2024 Healthcare. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
