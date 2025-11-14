'use client';
import NavBar from './NavBar';
import Footer from './Footer';
import { AuthProvider } from '@/lib/context/AuthContext';
import { QueryProvider } from '@/lib/providers/QueryProvider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {



    return (
        <QueryProvider>
            <AuthProvider>
                <div className='min-h-screen flex flex-col'>
                    <NavBar />
                    <main className='flex-1'>
                        {children}
                    </main>
                    <Footer />
                </div>
            </AuthProvider>
        </QueryProvider>
    );
}