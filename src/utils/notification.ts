// Hàm gửi thông báo cho admin
export function notifyAdmin({ type, title, content }: { type: string; title: string; content: string }) {
    const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    adminNotifications.push({
        id: Date.now() + Math.random(),
        type,
        title,
        content,
        createdAt: new Date().toISOString(),
        read: false,
    });
    localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
}

// Hàm gửi thông báo cho user
export function notifyUser({ type, title, content, userId }: { type: string; title: string; content: string; userId: string }) {
    const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    userNotifications.push({
        id: Date.now() + Math.random(),
        type,
        title,
        content,
        createdAt: new Date().toISOString(),
        read: false,
        userId,
    });
    localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
}

// Hàm gửi thông báo cho tất cả user
export function notifyAllUsers({ type, title, content }: { type: string; title: string; content: string }) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    users.forEach((u: any) => {
        userNotifications.push({
        id: Date.now() + Math.random(),
        type,
        title,
        content,
        createdAt: new Date().toISOString(),
        read: false,
        userId: u.id,
        });
    });
    localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
}

// Lấy thông báo cho admin
export function getAdminNotifications() {
    return JSON.parse(localStorage.getItem('adminNotifications') || '[]');
}

// Lấy thông báo cho user hiện tại
export function getUserNotifications(currentUserId: string) {
    const all = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    return all.filter((n: any) => n.userId === currentUserId);
}

// Đánh dấu tất cả thông báo admin là đã đọc
export function markAllAdminNotificationsAsRead() {
  const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
  const updated = adminNotifications.map((n: any) => ({ ...n, read: true }));
  localStorage.setItem('adminNotifications', JSON.stringify(updated));
}

// Đánh dấu một thông báo admin là đã đọc
export function markAdminNotificationAsRead(id: string) {
  const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
  const updated = adminNotifications.map((n: any) =>
    n.id === id ? { ...n, read: true } : n
  );
  localStorage.setItem('adminNotifications', JSON.stringify(updated));
}

// Thông báo khi tài liệu được duyệt
export function notifyDocumentApproved(userId: string, documentTitle: string) {
  notifyUser({
    type: 'document_approved',
    title: 'Tài liệu đã được duyệt',
    content: `Tài liệu "${documentTitle}" của bạn đã được duyệt và có thể tải xuống.`,
    userId,
  });
}

// Thông báo khi tài liệu bị từ chối
export function notifyDocumentRejected(userId: string, documentTitle: string) {
  notifyUser({
    type: 'document_rejected',
    title: 'Tài liệu bị từ chối',
    content: `Tài liệu "${documentTitle}" của bạn đã bị từ chối. Vui lòng kiểm tra lại nội dung.`,
    userId,
  });
}

// Thông báo khi admin đăng tài liệu mới
export function notifyNewDocumentByAdmin(documentTitle: string) {
  notifyAllUsers({
    type: 'admin_new_document',
    title: 'Tài liệu mới',
    content: `Admin vừa đăng tài liệu mới: "${documentTitle}". Hãy kiểm tra ngay!`,
  });
}

// Thông báo cho admin khi duyệt/từ chối tài liệu
export const notifyAdminDocumentApproval = (documentTitle: string, status: 'approved' | 'rejected') => {
  const notifications = getAdminNotifications();
  const newNotification = {
    id: Date.now().toString(),
    title: `Tài liệu ${status === 'approved' ? 'đã được duyệt' : 'đã bị từ chối'}`,
    message: `Tài liệu "${documentTitle}" ${status === 'approved' ? 'đã được duyệt thành công' : 'đã bị từ chối'}`,
    type: 'document',
    read: false,
    timestamp: new Date().toISOString(),
    documentTitle,
    status
  };
  localStorage.setItem('adminNotifications', JSON.stringify([newNotification, ...notifications]));
};

// Thông báo cho admin khi có tài liệu mới được đăng tải
export const notifyAdminNewDocument = (documentTitle: string, uploaderName: string) => {
  const notifications = getAdminNotifications();
  const newNotification = {
    id: Date.now().toString(),
    title: 'Tài liệu mới cần duyệt',
    message: `Tài liệu "${documentTitle}" đã được đăng tải bởi ${uploaderName}`,
    type: 'document',
    read: false,
    timestamp: new Date().toISOString(),
    documentTitle,
    uploaderName
  };
  localStorage.setItem('adminNotifications', JSON.stringify([newNotification, ...notifications]));
};

// Đánh dấu tất cả thông báo user là đã đọc
export function markAllUserNotificationsAsRead(userId: string) {
  const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
  const updated = userNotifications.map((n: any) =>
    n.userId === userId ? { ...n, read: true } : n
  );
  localStorage.setItem('userNotifications', JSON.stringify(updated));
}

// Đánh dấu một thông báo user là đã đọc
export function markUserNotificationAsRead(id: string) {
  const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
  const updated = userNotifications.map((n: any) =>
    n.id === id ? { ...n, read: true } : n
  );
  localStorage.setItem('userNotifications', JSON.stringify(updated));
} 