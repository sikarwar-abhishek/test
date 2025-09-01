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
  segeo,
} from "@/src/app/fonts";

export const metadata = {
  title: "DailyIQ",
  description: "Ignite your intellect with Daily IQ.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${fDemoBold.variable} ${fDemoRegular.variable} ${nunitoSans.variable} ${roboto.className} ${poppins.variable} ${segeo.variable} ${montserrat.variable} ${opensans.variable} ${monasans.variable} ${inter.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
