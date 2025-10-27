import "../globals.css";
import Providers from "@/src/utils/Providers";
import {
  arial,
  arialR,
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
  description: "We are a global community of curious thinkers, lifelong learners and problem-solvers, united by a passion for daily intellectual challenges. It's brain-boosting fun, right at your fingertips.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${arialR.variable} ${arial.variable} ${fDemoBold.variable} ${fDemoRegular.variable} ${nunitoSans.variable} ${roboto.className} ${poppins.variable} ${segeo.variable} ${montserrat.variable} ${opensans.variable} ${monasans.variable} ${inter.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
