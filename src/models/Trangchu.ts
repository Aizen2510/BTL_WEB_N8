import { useState } from 'react';
import type { Document, Category } from '@/services/ThaoTacTaiLieu/typings';
import { getDocuments, getCategories } from '@/services/ThaoTacTaiLieu/index';

const useTrangChuModel = () => {
  // State cho thống kê, tài liệu, danh mục, thông báo
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDocs: 0,
    totalCategories: 0,
    totalDownloads: 0,
    newDocsThisMonth: 0,
  });

  // Hàm tải dữ liệu tổng hợp cho trang chủ
  const fetchHomeData = () => {
    const docs: Document[] = getDocuments();
    const cats: Category[] = getCategories();
    // Recent documents: sort by uploadDate desc, lấy 5 tài liệu mới nhất
    const recent = [...docs]
      .sort((a, b) => {
        const [da, ma, ya] = a.uploadDate.split('/').map(Number);
        const [db, mb, yb] = b.uploadDate.split('/').map(Number);
        return new Date(yb, mb - 1, db).getTime() - new Date(ya, ma - 1, da).getTime();
      })
      .slice(0, 5)
      .map(doc => ({
        id: doc.id,
        title: doc.title,
        category: cats.find(c => c.id === doc.category)?.name || doc.category,
        type: doc.fileType?.toUpperCase() || 'Khác',
        date: doc.uploadDate,
        downloads: doc.downloadCount,
      }));
    setRecentDocuments(recent);

    // Thống kê danh mục: lấy top 5 danh mục có nhiều tài liệu nhất
    const catMap: Record<string, number> = {};
    docs.forEach(doc => {
      const catName = cats.find(c => c.id === doc.category)?.name || doc.category;
      catMap[catName] = (catMap[catName] || 0) + 1;
    });
    const catData = Object.entries(catMap)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    setCategoryData(catData);

    // Thông báo: lấy 5 tài liệu mới nhất làm thông báo mẫu
    setNotifications(recent.map(doc => ({
      id: doc.id,
      content: `Tài liệu mới: ${doc.title}`,
      date: doc.date,
    })));

    // Thống kê tổng
    const totalDocs = docs.length;
    const totalCategories = cats.length;
    const totalDownloads = docs.reduce((sum, d) => sum + d.downloadCount, 0);
    const now = new Date();
    const newDocsThisMonth = docs.filter(doc => {
      const [d, m, y] = doc.uploadDate.split('/').map(Number);
      return m === now.getMonth() + 1 && y === now.getFullYear();
    }).length;
    setStats({ totalDocs, totalCategories, totalDownloads, newDocsThisMonth });
  };

  return {
    // State
    recentDocuments,
    setRecentDocuments,
    categoryData,
    setCategoryData,
    notifications,
    setNotifications,
    stats,
    setStats,
    // Actions
    fetchHomeData,
  };
};

export default useTrangChuModel;