export interface Document {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  format: string; // pdf, docx, ...
  categoryId: number;
  categoryName?: string;
  uploadedBy: string;
  uploadedById: number;
  createdAt: string;
  downloadCount: number;
  isApproved: boolean;
}
