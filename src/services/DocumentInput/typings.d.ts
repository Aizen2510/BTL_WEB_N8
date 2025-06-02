export interface DocumentInput {
  title: string;
  description: string;
  file: File; // khi tạo mới
  format: string;
  categoryId: number;
}
