import './globals.css';
import localFont from 'next/font/local';

const vazir = localFont({
  src: [
    { path: './fonts/vazir/Vazir-Regular-FD.woff2', weight: '400' },
    { path: './fonts/vazir/Vazir-Medium-FD.woff2', weight: '500' },
    { path: './fonts/vazir/Vazir-Bold-FD.woff2', weight: '700' },
  ],
  variable: 'font-family',
  display: 'swap',
});

export default function RootLayout({  children }) {
  
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="bg-gray-100 text-gray-800 font-vazir">
        {children}
      </body>
    </html>
  );
}
