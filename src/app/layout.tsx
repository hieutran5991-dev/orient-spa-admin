import { Outfit } from 'next/font/google';
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import { AlertProvider } from '@/context/AlertContext';
import { LanguageProvider } from '@/context/LanguageContext';
import AlertContainer from '@/components/common/AlertContainer';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          <AlertProvider>
            <AuthProvider>
              <LanguageProvider>
                <ThemeProvider>
                  <SidebarProvider>
                    <AuthGuard>
                      <AlertContainer />
                      {children}
                    </AuthGuard>
                  </SidebarProvider>
                </ThemeProvider>
              </LanguageProvider>
            </AuthProvider>
          </AlertProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
