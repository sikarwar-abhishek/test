"use client";

import { HEADER_NAV } from "@/src/constants/constant";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="flex py-4 md:py-6 justify-between items-center relative">
      {/* logo - Now clickable */}
      <Link href="/" className="flex items-center gap-4">
        <div className="relative aspect-square w-38 h-10">
          <Image
            src={"/asset/logo-black.png"}
            alt="logo"
            fill
            className="object-contain"
          />
        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-4 -mr-4">
        {HEADER_NAV.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`font-nunito text-lg
              ${
                item.name === "Login"
                  ? "border-2 border-blue-600 rounded-lg px-6 py-2 text-blue-600 hover:bg-accent font-semibold"
                  : "font-normal hover:text-gray-500 transition-colors duration-300"
              }
            `}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Navigation Menu */}
      <div
        ref={menuRef}
        className={`md:hidden absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-200 ease-in-out overflow-hidden z-50 ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col py-2">
          {HEADER_NAV.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={`font-nunito text-base py-2 px-4
                ${
                  item.name === "Login"
                    ? "border border-blue-600 rounded mx-2 text-blue-600 hover:bg-blue-50 font-semibold mt-1 mb-1 text-center"
                    : "font-normal text-gray-700 hover:bg-gray-100"
                }
                ${index < HEADER_NAV.length - 1 ? 'border-b border-gray-100' : ''}
              `}
              onClick={handleLinkClick}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-10 z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
}

export default Header;