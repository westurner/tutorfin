import type { ReactNode } from "react";
import { Providers } from "./providers";

export const metadata = {
  title: "TutorFin",
  description: "Financial literacy exhibit",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
