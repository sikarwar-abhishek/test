import "../globals.css";
import Providers from "@/src/utils/Providers";
import {
  fDemoBold,
  fDemoRegular,
  inter,
  monasans,
  montserrat,
  nunitoSans,
  opensans,
  poppins,
  roboto,
  rubik,
  segeo,
} from "@/src/app/fonts";
import SideBar from "@/src/components/common/SideBar";

export const metadata = {
  title: "DailyIQ",
  description: "Ignite your intellect with Daily IQ.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${fDemoBold.variable} ${fDemoRegular.variable} ${nunitoSans.variable} ${roboto.className} ${poppins.variable} ${segeo.variable} ${montserrat.variable} ${opensans.variable} ${monasans.variable} ${inter.variable} ${rubik.variable} antialiased`}
      >
        <Providers>
          <div className="flex">
            <SideBar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
