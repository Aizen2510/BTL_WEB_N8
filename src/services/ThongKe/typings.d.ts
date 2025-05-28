export interface ChartDataItem {
  type: string;
  value: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  uploadDate: string;
  uploadBy: string;
  downloads: number;
  status: string;
}

interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export interface UploaderStat {
  uploader: string;
  count: number;
  percentage: number;
}
