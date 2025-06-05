declare module Document {
    export interface Record {
        id: string;
        title: string;
        description: string;
        fileUrl: string;
        categoryId: String;
        categoryName: String;
        uploaderId: string;
        uploaderName?: string;
        uploadDate: string; // ISO string
        downloadCount: number;
        isApproved: 'approved' | 'pending' | 'rejected'; // 'approved' = Đã duyệt, 'pending' = Chờ duyệt
    }
}

