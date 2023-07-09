import 'styles/globals.css';
import Providers from './Providers';

export default function RootLayout({ children }: Layout) {
  return (
    // By default i use dark mode, so it can be in some places a little bit annoying but i am prepare for it :)
    <html lang="pl" suppressHydrationWarning className="dark">
      <body className="relative bg-gray-900 antialiased">
        <Providers>
          <div className="mx-auto flex min-h-screen flex-grow flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
