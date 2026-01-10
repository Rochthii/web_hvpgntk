
import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import { cn } from '../../lib/utils';
import { showToast } from '../../lib/toast';

interface Notification {
    id: string;
    title: string;
    message: string;
    link: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'system';
    is_read: boolean;
    created_at: string;
}

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const res = await client.get<Notification[]>('/core/notifications/');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.is_read).length);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(fetchNotifications, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markRead = async (id: string) => {
        try {
            await client.post(`/core/notifications/${id}/read/`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(error);
        }
    };

    const markAllRead = async () => {
        try {
            await client.post('/core/notifications/mark_all_read/');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
            showToast.success('Đã đánh dấu tất cả là đã đọc');
        } catch (error) {
            console.error(error);
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'success': return 'text-green-500 bg-green-50';
            case 'warning': return 'text-yellow-500 bg-yellow-50';
            case 'error': return 'text-red-500 bg-red-50';
            default: return 'text-blue-500 bg-blue-50';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="p-2 rounded-full hover:bg-gray-100 relative text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden animation-fade-in-up">
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-700 text-sm">Thông báo</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-primary hover:text-primary-dark font-medium flex items-center"
                            >
                                <Check size={14} className="mr-1" /> Đã đọc hết
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center">
                                <Bell size={32} className="mb-2 opacity-20" />
                                Không có thông báo mới
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map(n => (
                                    <div
                                        key={n.id}
                                        className={cn(
                                            "p-4 hover:bg-gray-50 transition-colors cursor-pointer group relative",
                                            !n.is_read ? "bg-blue-50/30" : ""
                                        )}
                                        onClick={() => markRead(n.id)}
                                    >
                                        <div className="flex gap-3">
                                            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1", getIconColor(n.type))}>
                                                <Bell size={14} />
                                            </div>
                                            <div className="flex-1">
                                                <p className={cn("text-sm mb-0.5", !n.is_read ? "font-bold text-gray-800" : "font-medium text-gray-600")}>
                                                    {n.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mb-1 leading-relaxed">{n.message}</p>
                                                <span className="text-[10px] text-gray-400">
                                                    {new Date(n.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            {!n.is_read && (
                                                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-2 border-t border-gray-100 text-center">
                        <Link to="/notifications" className="text-xs text-gray-500 hover:text-plugin font-medium w-full block py-1">
                            Xem tất cả
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};
