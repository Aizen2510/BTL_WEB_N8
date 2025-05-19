declare module Document {
    export interface Record {
        id: string;
        title: string;
        description: string;
        fileUrl: string;
        fileType: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'other';
        categoryId: string;
        categoryName?: string;
        uploaderId: string;
        uploaderName?: string;
        uploadDate: string; // ISO string
        downloadCount: number;
        isApproved: 'approved' | 'pending'; // 'approved' = Đã duyệt, 'pending' = Chờ duyệt
    }
}

