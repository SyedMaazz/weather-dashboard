import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className="dot-bg text-text min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}