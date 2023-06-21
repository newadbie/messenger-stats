import "styles/globals.css";

export default function RootLayout({ children }: Layout) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className="relative bg-gray-900 antialiased">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-grow flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
