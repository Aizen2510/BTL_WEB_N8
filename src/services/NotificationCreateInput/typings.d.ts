export interface NotificationCreateInput {
  title: string;
  content: string;
  receiverRole: 'student' | 'admin';
  type: 'new_document' | 'pending_approval';
}
