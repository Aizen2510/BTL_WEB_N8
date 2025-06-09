import { useState, useEffect } from 'react';
import {
  getUserNotifications,
  markAllUserNotificationsAsRead,
  markUserNotificationAsRead,
} from '@/utils/notification';

export default function useUserNotification() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    // Lấy tất cả thông báo của user hiện tại
    const all = getUserNotifications(currentUser.id);
    // Lọc chỉ lấy thông báo tài liệu đã duyệt/từ chối hoặc admin thêm tài liệu
    const filtered = all.filter((n: any) =>
      n.type === 'document_approved' ||
      n.type === 'document_rejected' ||
      n.type === 'admin_new_document'
    );
    setNotifications(filtered);
    const onStorage = () => {
      const allNoti = getUserNotifications(currentUser.id);
      const filteredNoti = allNoti.filter((n: any) =>
        n.type === 'document_approved' ||
        n.type === 'document_rejected' ||
        n.type === 'admin_new_document'
      );
      setNotifications(filteredNoti);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const markAllAsRead = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    markAllUserNotificationsAsRead(currentUser.id);
    setNotifications(getUserNotifications(currentUser.id));
  };

  const markOneAsRead = (id: string) => {
    markUserNotificationAsRead(id);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setNotifications(getUserNotifications(currentUser.id));
  };

  return {
    notifications,
    unread: notifications.filter(n => !n.read).length,
    total: notifications.length,
    setNotifications,
    markAllAsRead,
    markOneAsRead,
  };
} 