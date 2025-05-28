export interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  uploadedBy: string;
  uploadDate: string;
  fileType: string;
  fileSize: number;
  downloadCount: number;
  status: 'pending' | 'approved' | 'rejected';
  fileUrl: string;
}

export interface Category {
  id: string;
  name: string;
}