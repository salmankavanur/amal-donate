import { Montserrat } from 'next/font/google';
import "./globals.css"

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata = {
  title: 'AIC Alumni - Donation Platform',
  description: 'Support AIC Alumni initiatives through donations and volunteering.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="text-center py-4 bg-gray-800 text-white">
          © 2025 AIC Alumni
        </footer>
      </body>
    </html>
  );
}