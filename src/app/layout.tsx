import "styles/globals.css";

export default function RootLayout({ children }: Layout) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className="relative bg-gray-50 antialiased dark:bg-gray-900">
        <div className="flex min-h-screen flex-grow flex-col">{children}</div>
      </body>
    </html>
  );
}
