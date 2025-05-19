declare module DocumentReport {
  /** Tổng quan tài liệu (toàn bộ danh sách) */
  export interface DocumentItem {
    id: string;
    title: string;
    fileType: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'other';
    categoryId: string;
    categoryName: string;
    uploaderId: string;
    uploaderName: string;
    uploadDate: string; // ISO string
    downloadCount: number;
    isApproved: 'approved' | 'pending';
  }

  /** Thống kê số lượng tài liệu theo danh mục */
  export interface CategoryStatistic {
    categoryName: string;
    totalDocuments: number;
  }

  /** Thống kê số lượng tài liệu theo người đăng */
  export interface UploaderStatistic {
    uploaderName: string;
    totalDocuments: number;
  }

  /** Thống kê số lượng tài liệu theo định dạng */
  export interface FileTypeStatistic {
    fileType: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'other';
    totalDocuments: number;
  }

  /** Thống kê lượt tải tổng thể */
  export interface DownloadStatistic {
    totalDownloads: number;
    byDocument: {
      documentId: string;
      title: string;
      downloadCount: number;
    }[];
    byCategory: {
      categoryName: string;
      totalDownloads: number;
    }[];
  }

  /** Dữ liệu biểu đồ số lượng tài liệu theo danh mục */
  export interface ChartCategory {
    name: string; // categoryName
    value: number; // totalDocuments
  }

  /** Dữ liệu biểu đồ tài liệu có lượt tải cao nhất */
  export interface ChartTopDownload {
    name: string; // document title
    value: number; // downloadCount
  }

  /** Bộ lọc xuất Excel */
  export interface ExportFilter {
    categoryId?: string;
    uploaderId?: string;
    fromDate?: string; // ISO
    toDate?: string;   // ISO
    isApproved?: 'approved' | 'pending';
  }

  /** Dữ liệu xuất Excel */
  export interface ExcelExportRow {
    title: string;
    fileType: string;
    categoryName: string;
    uploaderName: string;
    uploadDate: string;
    downloadCount: number;
    status: string; // 'Đã duyệt' / 'Chờ duyệt'
  }
}
