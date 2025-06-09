import { useState, useEffect } from 'react';
import { 
  getAdminNotifications, 
  markAllAdminNotificationsAsRead, 
  markAdminNotificationAsRead,
  notifyAdminDocumentApproval,
  notifyAdminNewDocument
} from '@/utils/notification';

export default function useAdminNotification() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    setNotifications(getAdminNotifications());
    const onStorage = () => setNotifications(getAdminNotifications());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const markAllAsRead = () => {
    markAllAdminNotificationsAsRead();
    setNotifications(getAdminNotifications());
  };

  const markOneAsRead = (id: string) => {
    markAdminNotificationAsRead(id);
    setNotifications(getAdminNotifications());
  };

  const notifyDocumentApproval = (documentTitle: string, status: 'approved' | 'rejected') => {
    notifyAdminDocumentApproval(documentTitle, status);
    setNotifications(getAdminNotifications());
  };

  const notifyNewDocument = (documentTitle: string, uploaderName: string) => {
    notifyAdminNewDocument(documentTitle, uploaderName);
    setNotifications(getAdminNotifications());
  };

  return {
    notifications,
    unread: notifications.filter(n => !n.read).length,
    total: notifications.length,
    setNotifications,
    markAllAsRead,
    markOneAsRead,
    notifyDocumentApproval,
    notifyNewDocument
  };
} 