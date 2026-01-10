import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { Menu } from 'lucide-react';
import { NotificationBell } from '../components/layout/NotificationBell';
import { Sidebar } from '../components/admin/Sidebar';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, isLoading } = useAuth();

    // Redirect if student tries to access admin
    if (!isLoading && user?.role === 'student') {
        window.location.href = '/portal';
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Mobile Sidebar Overlay */}
            <div
                className={cn("fixed inset-0 bg-black/50 z-40 lg:hidden", sidebarOpen ? "block" : "hidden")}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar Component */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center space-x-4 ml-auto">
                        <NotificationBell />
                    </div>
                </header>

                {/* Content Body */}
                <main className="flex-1 overflow-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};
