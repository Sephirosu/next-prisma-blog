"use client";
import Switch from "../Navbar/Switch";
import { useState, useEffect } from "react";

const Footer = () => {
  const [isFooter, setIsFooter] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsFooter(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <footer className="bg-gray-100 ">
      <div className="max-w-7xl  mx-auto">
        <div className="flex mx-3 justify-between py-1 xs:tracking-tight xsm:tracking-normal">
          <p>About</p>
          <p>Quick Link</p>
          <p>Category</p>
          {isFooter && (
            <p className="">
              <Switch isFooter={isFooter} />
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
