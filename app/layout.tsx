import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import { AuthProvider } from '@/src/context/AuthContext';
import './globals.css';

const cairo = Cairo({
    subsets: ['arabic', 'latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Tolzy Sign In',
    description: 'Authentication System for Tolzy',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl">
            <body className={cairo.className}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}