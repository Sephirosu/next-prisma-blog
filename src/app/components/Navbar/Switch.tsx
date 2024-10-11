"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const Switch = ({ isFooter }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (typeof window !== "undefined") {
      document.body.classList.toggle("dark", !isDarkMode);
    }
  };

  return (
    <div
      onClick={toggleDarkMode}
      className={`items-center cursor-pointer select-none w-10 h-6 rounded-full transition-all duration-300 
                  ${isDarkMode ? "bg-gray-700" : "bg-[#e8e8ea]"}
                  ${isFooter ? "block" : "hidden lg:block"}`}
    >
      <div
        className={`flex items-center justify-center w-6 h-6 rounded-full transition-transform duration-300 
                      ${isDarkMode ? "translate-x-4" : "translate-x-0"}`}
      >
        <Image
          src="framedark.svg"
          alt="Switcher"
          width={24}
          height={24}
          className="mt-0.5 w-6"
        />
      </div>
    </div>
  );
};

export default Switch;
