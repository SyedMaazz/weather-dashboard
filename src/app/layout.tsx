import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "Nothing Weather",
  description: "Pixel weather dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
     <body className="dot-bg min-h-screen text-white antialiased">
  {children}
</body>
    </html>
  );
}