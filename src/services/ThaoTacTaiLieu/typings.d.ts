export interface Document {
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
        isApproved: 'approved' | 'pending' | 'rejected';
}

export interface Category {
  categoryId: string,
  categoryName: string,
  description: string,
  documentCount: number,
}