import localFont from "next/font/local";
import { Inter, Montserrat, Open_Sans, Poppins, Rubik } from "next/font/google";

const fDemoBold = localFont({
  src: "./local/FDEMO-bold.woff2",
  variable: "--font-fdemo-bold",
  display: "swap",
  weight: "100 900",
});

const fDemoRegular = localFont({
  src: "./local/FDEMO-regular.woff2",
  variable: "--font-fdemo-regular",
  display: "swap",
  weight: "100 900",
});

const nunitoSans = localFont({
  src: "./local/NunitoSans.woff2",
  variable: "--font-nunito-sans",
  display: "swap",
  weight: "100 900",
});

const roboto = localFont({
  src: "./local/Roboto.woff2",
  variable: "--font-roboto",
  display: "swap",
  weight: "100 900",
});

const segeo = localFont({
  src: "./local/segeo.woff2",
  variable: "--font-segeo",
  display: "swap",
  weight: "100 900",
});

const poppins = Poppins({
  variable: "--font-poppins",
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const opensans = Open_Sans({
  variable: "--font-open-sans",
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const monasans = localFont({
  src: "./local/monasans.woff2",
  variable: "--font-mona-sans",
  display: "swap",
  weight: "100 900",
});

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});
const rubik = Rubik({
  variable: "--font-rubik",
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
export {
  nunitoSans,
  fDemoBold,
  fDemoRegular,
  inter,
  rubik,
  roboto,
  poppins,
  segeo,
  montserrat,
  opensans,
  monasans,
};
