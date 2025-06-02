declare module Notification {
  export interface Record {
    id: string;
    title: string;
    content: string;
    receiverRole: 'admin' | 'user'; // người nhận
    receiverId?: string; // optional nếu thông báo cho từng user cụ thể
    createdAt: string;
    read: boolean;
  }
}
