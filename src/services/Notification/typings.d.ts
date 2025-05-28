export interface Notification {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  type: 'new_document' | 'pending_approval';
  receiverRole: 'student' | 'admin';
  isRead: boolean;
}
