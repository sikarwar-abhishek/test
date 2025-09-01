import Image from "next/image";
import Icon from "./Icon";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-[#4676FA] text-white px-20 pt-12">
      <div className="">
        {/* Top section */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative aspect-square w-38 h-10">
              <Image
                src={"/asset/logo-white.png"}
                alt="logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex gap-6 text-lg">
            <Link
              href="#"
              className="text-white hover:text-gray-200 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="#"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right side - Navigation and social icons */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-6">
            <Link href="#">
              <Icon name="appstore" className="w-34 h-24" />
            </Link>
            <Link href="#">
              <Icon name="googleplay" className="w-38 h-24" />
            </Link>
          </div>

          {/* Social media icons */}
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Icon name="youtube" className="w-6 h-6" />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Icon name="facebook" className="w-6 h-6" />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Icon name="instagram" className="w-6 h-6" />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Icon name="linkedin" className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col py-9 md:flex-row justify-between items-start md:items-center border-t border-[rgba(0,0,0,0.17)] gap-4">
          {/* Copyright */}
          <div className="text-lg text-blue-100">
            dailyIQ @ 2025 All rights reserved.
          </div>

          {/* Footer links */}
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-lg text-white/90 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-lg text-white/90 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-lg text-white/90 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
