import { useState, useEffect, useRef } from 'react';
import { getDocuments } from '@/services/ThaoTacTaiLieu/index';
import type { Document } from '@/services/ThaoTacTaiLieu/typings';
import type { TablePaginationConfig } from 'antd/es/table';
import type { Moment } from 'moment';
import { message } from 'antd';

export default function useThongKeModel() {
  const [loading, setLoading] = useState<boolean>(false);
  const [chartType, setChartType] = useState<'category' | 'uploader'>('category');
  const [timeRange, setTimeRange] = useState<[Moment, Moment] | null>(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [uploaderData, setUploaderData] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const prevDocumentsRef = useRef<any[]>([]);

  useEffect(() => {
    fetchStatistics();
    // eslint-disable-next-line
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const docs: Document[] = getDocuments();
      let filteredDocs = docs;
      if (timeRange) {
        const [start, end] = timeRange;
        filteredDocs = docs.filter(doc => {
          const [d, m, y] = doc.uploadDate.split('/').map(Number);
          const docDate = new Date(y, m - 1, d);
          return docDate >= start.toDate() && docDate <= end.toDate();
        });
      }
      const docItems = filteredDocs.map(doc => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        uploadDate: doc.uploadDate,
        uploadBy: doc.uploadedBy,
        downloads: doc.downloadCount,
        status: doc.status === 'approved' ? 'Đã duyệt' : doc.status === 'pending' ? 'Chờ duyệt' : 'Đã từ chối',
      }));
      setDocuments(docItems);
      setTotalDocuments(filteredDocs.length);
      setTotalApproved(filteredDocs.filter(d => d.status === 'approved').length);
      setTotalPending(filteredDocs.filter(d => d.status === 'pending').length);
      setTotalRejected(filteredDocs.filter(d => d.status === 'rejected').length);
      const categoryMap: Record<string, number> = {};
      filteredDocs.forEach(doc => {
        const catName = doc.category;
        categoryMap[catName] = (categoryMap[catName] || 0) + 1;
      });
      const categoryChart = Object.entries(categoryMap).map(([type, value]) => ({ type, value }));
      setCategoryData(categoryChart);
      const uploaderMap: Record<string, number> = {};
      filteredDocs.forEach(doc => {
        uploaderMap[doc.uploadedBy] = (uploaderMap[doc.uploadedBy] || 0) + 1;
      });
      const uploaderChart = Object.entries(uploaderMap).map(([type, value]) => ({ type, value }));
      setUploaderData(uploaderChart);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  // Notification logic
  function diffDocuments(prev: any[], curr: any[]) {
    const changes: any[] = [];
    const prevMap = new Map(prev.map((d) => [d.id, d]));
    const currMap = new Map(curr.map((d) => [d.id, d]));
    curr.forEach((d) => {
      if (!prevMap.has(d.id)) changes.push({ id: d.id, title: d.title, type: 'add', date: d.uploadDate });
    });
    prev.forEach((d) => {
      if (!currMap.has(d.id)) changes.push({ id: d.id, title: d.title, type: 'delete', date: d.uploadDate });
    });
    curr.forEach((d) => {
      const old = prevMap.get(d.id);
      if (old && JSON.stringify(old) !== JSON.stringify(d)) changes.push({ id: d.id, title: d.title, type: 'edit', date: d.uploadDate });
    });
    return changes;
  }

  useEffect(() => {
    const prevDocs = prevDocumentsRef.current;
    const changes = diffDocuments(prevDocs, documents);
    if (changes.length > 0) {
      setNotifications((prev) => {
        const merged = [...changes.reverse(), ...prev].slice(0, 6);
        const unique: any[] = [];
        const seen = new Set();
        for (const n of merged) {
          const key = n.id + n.type + n.date;
          if (!seen.has(key)) {
            unique.push(n);
            seen.add(key);
          }
        }
        return unique.slice(0, 6);
      });
    }
    prevDocumentsRef.current = documents;
  }, [documents]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const handleTimeRangeChange = (dates: [Moment, Moment] | null) => {
    setTimeRange(dates);
  };

  const handleExportExcel = () => {
    message.success('Đang xuất file Excel...');
  };

  return {
    loading,
    chartType,
    setChartType,
    timeRange,
    setTimeRange,
    categoryData,
    uploaderData,
    documents,
    pagination,
    setPagination,
    showNotifications,
    setShowNotifications,
    totalDocuments,
    totalApproved,
    totalPending,
    totalRejected,
    notifications,
    handleTableChange,
    handleTimeRangeChange,
    handleExportExcel,
    fetchStatistics,
  };
}
