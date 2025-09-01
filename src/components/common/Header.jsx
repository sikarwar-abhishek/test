import { HEADER_NAV } from "@/src/constants/constant";
import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <header className="flex py-6 justify-between items-center">
      {/* logo */}
      <div className="flex items-center gap-4">
        <div className="relative aspect-square w-38 h-10">
          <Image
            src={"/asset/logo-black.png"}
            alt="logo"
            fill
            className="object-contain"
          />
        </div>
        {/* <h2 className="font-bold text-3xl">Daily&nbsp;IQ</h2> */}
      </div>

      {/* nav */}
      <div className="flex items-center gap-4 -mr-4">
        {HEADER_NAV.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`font-nunito text-lg
              ${
                item.name === "Sign up"
                  ? "border-2 border-blue-600 rounded-lg px-6 py-2 text-blue-600 hover:bg-accent font-semibold"
                  : "font-normal hover:text-gray-500 transition-colors duration-300"
              }
            `}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </header>
  );
}

export default Header;
