import { Archivo, IBM_Plex_Sans } from "next/font/google";

// Display: Archivo at a condensed width reads like stamped labelling on a battery case. Body: IBM Plex Sans.
export const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
