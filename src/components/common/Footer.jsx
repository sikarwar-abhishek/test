import Image from "next/image";
import Icon from "./Icon";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-[#4676FA] text-white px-4 sm:px-8 md:px-12 lg:px-20 pt-8 md:pt-10 lg:pt-12">
      <div className="">
        {/* Top section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative aspect-square w-28 sm:w-32 md:w-36 h-7 sm:h-8 md:h-10">
              <Image
                src={"/asset/logo-white.png"}
                alt="logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex gap-4 sm:gap-5 md:gap-6 text-base sm:text-lg">
            <Link
              href="/about-us"
              className="text-white hover:text-gray-200 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/login"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right side - Navigation and social icons */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center mt-6 md:mt-8 gap-6 md:gap-0">
          <div className="flex gap-4 md:gap-5 lg:gap-6">
            <Link href="#">
              <Icon name="appstore" className="w-28 sm:w-32 md:w-34 h-20 sm:h-22 md:h-24" />
            </Link>
            <Link href="#">
              <Icon name="googleplay" className="w-32 sm:w-34 md:w-38 h-20 sm:h-22 md:h-24" />
            </Link>
          </div>

          {/* Social media icons */}
          {/* <div className="flex gap-3 sm:gap-4">
            <Link
              href="#"
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Icon name="youtube" className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Icon name="facebook" className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Icon name="instagram" className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Icon name="linkedin" className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          </div> */}
        </div>

        {/* Bottom section */}
        <div className="flex flex-col py-6 md:py-8 lg:py-9 md:flex-row justify-between items-start md:items-center border-t border-[rgba(0,0,0,0.17)] gap-3 md:gap-4 mt-6 md:mt-0">
          {/* Copyright */}
          <div className="text-sm sm:text-base md:text-lg text-blue-100 order-2 md:order-1">
            dailyIQ @ 2025 All rights reserved.
          </div>

          {/* Footer links */}
          <div className="flex gap-4 sm:gap-5 md:gap-6 order-1 md:order-2">
            {/* <Link
              href="#"
              className="text-sm sm:text-base md:text-lg text-white/90 hover:text-white transition-colors"
            >
              Terms
            </Link> */}
            <Link
              href="/privacy-policy"
              className="text-sm sm:text-base md:text-lg text-white/90 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            {/* <Link
              href="#"
              className="text-sm sm:text-base md:text-lg text-white/90 hover:text-white transition-colors"
            >
              Contact
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;