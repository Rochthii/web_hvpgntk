import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, X, Home, FileText, PlusCircle, Users, BookOpen, Calendar, ClipboardList } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../router/routes';

interface PortalSidebarProps {
    role: 'content' | 'teacher';
    isOpen: boolean;
    onClose: () => void;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({ role, isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login'); // Redirect to Staff Login page
    };

    const commonClass = "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1";
    const activeClass = "bg-amber-100 text-amber-800 font-bold";
    const inactiveClass = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

    const ContentMenus = [
        { path: ROUTES.PORTAL.CONTENT, label: 'Tổng quan', icon: Home },
        { path: ROUTES.PORTAL.CONTENT_NEWS, label: 'Quản lý tin tức', icon: FileText },
        { path: ROUTES.PORTAL.CONTENT_NEWS_CREATE, label: 'Đăng tin mới', icon: PlusCircle },
    ];

    const TeacherMenus = [
        { path: ROUTES.PORTAL.TEACHER, label: 'Tổng quan', icon: Home },
        { path: ROUTES.PORTAL.TEACHER_CLASSES, label: 'Lớp dạy', icon: BookOpen },
        { path: ROUTES.PORTAL.TEACHER_GRADES, label: 'Nhập điểm', icon: ClipboardList },
        { path: ROUTES.PORTAL.TEACHER_STUDENTS, label: 'Sinh viên', icon: Users },
        { path: '/portal/teacher/schedule', label: 'Lịch dạy', icon: Calendar },
    ];

    const menus = role === 'content' ? ContentMenus : TeacherMenus;

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                        <div className="flex items-center space-x-2">
                            <img src="/logo-hvpgntk.png" alt="HVPGNTK" className="w-8 h-8" />
                            <span className="font-serif font-bold text-gray-800">HVPGNTK</span>
                        </div>
                        <button onClick={onClose} className="md:hidden text-gray-500">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 py-6">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                            {role === 'content' ? 'Biên Tập Viên' : 'Giáo Thọ Sư'}
                        </div>

                        {menus.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `${commonClass} ${isActive ? activeClass : inactiveClass}`
                                }
                                onClick={() => window.innerWidth < 768 && onClose()}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer / Logout */}
                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};
