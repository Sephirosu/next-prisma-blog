"use client";
import NavLinks from "./NavLinks";
import Logo from "@/app/components/Navbar/Logo";
import Search from "./Search";
import Switch from "./Switch";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between max-w-7xl mx-auto mt-8 px-4">
        <Logo />

        {isMobile ? (
          <div className="flex-1 flex justify-center">
            <Search />
          </div>
        ) : (
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <NavLinks isMobile={false} />
          </div>
        )}

        <div className="flex items-center gap-10">
          {isMobile ? (
            <div className="cursor-pointer" onClick={toggleMenu}>
              {isMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </div>
          ) : (
            <>
              <Search />
              <Switch />
            </>
          )}
        </div>
      </div>

      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col justify-center items-center">
          <div
            className="absolute top-4 right-4 cursor-pointer"
            onClick={toggleMenu}
          >
            <FaTimes className="text-2xl" />
          </div>
          <div className="flex flex-col items-center space-y-4 h-full justify-center">
            <NavLinks isMobile={true} />{" "}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
