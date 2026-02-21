import "./globals.css";

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