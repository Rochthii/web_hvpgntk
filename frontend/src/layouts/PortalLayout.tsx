import React, { useState } from 'react';
import { PortalSidebar } from '../components/portal/PortalSidebar';
import { PortalHeader } from '../components/portal/PortalHeader';

interface PortalLayoutProps {
    children: React.ReactNode;
    role: 'content' | 'teacher';
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children, role }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <PortalSidebar
                role={role}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
                <PortalHeader
                    role={role}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
