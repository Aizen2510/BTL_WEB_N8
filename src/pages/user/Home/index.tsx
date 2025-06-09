import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message } from 'antd';
import {
  UploadOutlined,
  HomeOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import HomeContent from './HomeContent';
import useTaiLieuModel from '@/models/TaiLieu';
import NoticeIcon from '@/components/RightContent/NoticeIcon';
import useUserNotification from '@/models/userNotification';
import axios from 'axios';

const HomePage: React.FC = () => {
  const { documents, showNotifications, setShowNotifications } = useTaiLieuModel();
  const currentUserId = localStorage.getItem('currentUserId') || '';
  const { notifications, unread, markAllAsRead } = useUserNotification();

  const [topCategories, setTopCategories] = useState<any[]>([]);
  const [topDocuments, setTopDocuments] = useState<any[]>([]);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [totalDownloads, setTotalDownloads] = useState<number>(0);

  const fetchStatistics = async () => {
    try {
      const [
        topCategoriesRes,
        topDocumentsRes,
        totalDocumentsRes,
        totalCategoriesRes,
      ] = await Promise.all([
        axios.get('http://localhost:3000/api/statistics/top-categories?limit=5'),
        axios.get('http://localhost:3000/api/statistics/top-documents?limit=6'),
        axios.get('http://localhost:3000/api/statistics/total-documents'),
        axios.get('http://localhost:3000/api/statistics/total-categories'),
      ]);

      setTopCategories(topCategoriesRes.data);

      setTopDocuments(
        topDocumentsRes.data.map((doc: any) => ({
          ...doc,
          downloads: doc.downloadCount || 0,
          title: doc.title || 'Không có tiêu đề',
          uploaderName: doc.uploaderName || '',
          uploadDate: doc.uploadDate || '',
        }))
      );

      setTotalCategories(totalCategoriesRes.data.totalCategories || 0);
      setTotalDocuments(totalDocumentsRes.data.totalDocuments || 0);
      setTotalDownloads(totalDocumentsRes.data.totalDownloads || 0);
    } catch (error) {
      console.error('Lỗi khi gọi API thống kê:', error);
      message.error('Lỗi khi lấy dữ liệu thống kê');
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const menu = (
    <div className={styles.headerMenu}>
      <Button type="link" icon={<HomeOutlined />} href="/user/Home" style={{ fontWeight: 600 }}>
        Trang chủ
      </Button>
      <Button type="link" icon={<FileSearchOutlined />} href="/user/TaiLieu" style={{ fontWeight: 600 }}>
        Tài liệu
      </Button>
      <Button type="link" icon={<FileSearchOutlined />} href="/user/DanhMuc" style={{ fontWeight: 600 }}>
        Danh mục
      </Button>
      <Button type="link" icon={<UploadOutlined />} href="/user/ThaoTacTaiLieu" style={{ fontWeight: 600 }}>
        Thao tác tài liệu
      </Button>
    </div>
  );

  const handleAvatarClick = () => {
    window.location.href = '/login';
  };

  const handleNotificationClick = (id: string, type: string) => {
    window.location.href = `/user/TaiLieu?id=${id}&type=${type}`;
  };

  const stats = {
    totalCategories: totalCategories,
    totalDocuments: totalDocuments,
    totalDownloads: totalDownloads,
    newDocsThisMonth: documents.filter((doc) => {
      const [d, m, y] = doc.uploadDate.split('/').map(Number);
      const now = new Date();
      return m === now.getMonth() + 1 && y === now.getFullYear();
    }).length,
  };

  return (
    <PageContainer pageHeaderRender={false}>
      <HomeContent
        menu={menu}
        notificationContent={
          <NoticeIcon
            count={unread}
            onClear={markAllAsRead}
            list={notifications}
            title="Thông báo"
            emptyText="Bạn đã xem tất cả thông báo"
            showClear={!!unread}
            showViewMore={false}
          />
        }
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        handleAvatarClick={handleAvatarClick}
        stats={stats}
        recentDocuments={topDocuments}
        categoryData={topCategories.map((cat) => ({
          category: cat.categoryName || cat.name,
          value: cat.documentCount || 0,
        }))}
        documents={documents}
      />
    </PageContainer>
  );
};

export default HomePage;
