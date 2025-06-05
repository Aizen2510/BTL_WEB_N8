import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import { UploadOutlined, HomeOutlined, FileSearchOutlined, BarChartOutlined } from '@ant-design/icons';
import styles from './index.less';
import HomeContent from './HomeContent';
import ThongbaoPopover from '@/components/Thongbao';
import useTaiLieuModel from '@/models/TaiLieu';

const HomePage: React.FC = () => {
  // Sử dụng model để đồng bộ notification, recentDocuments, categoryData, stats
  const {
    documents,
    notifications,
    showNotifications,
    setShowNotifications,
  } = useTaiLieuModel();

  // recentDocuments: lấy tối đa 6 tài liệu mới nhất, realtime
  const recentDocuments = React.useMemo(() => {
    return [...documents]
      .sort((a, b) => {
        const [da, ma, ya] = a.uploadDate.split('/').map(Number);
        const [db, mb, yb] = b.uploadDate.split('/').map(Number);
        return new Date(yb, mb - 1, db).getTime() - new Date(ya, ma - 1, da).getTime();
      })
      .slice(0, 6);
  }, [documents]);

  // categoryData: top 5 danh mục nhiều tài liệu nhất
  const categoryData = React.useMemo(() => {
    const catMap: Record<string, number> = {};
    documents.forEach(doc => {
      catMap[doc.category] = (catMap[doc.category] || 0) + 1;
    });
    return Object.entries(catMap)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [documents]);

  // stats: tổng hợp
  const stats = React.useMemo(() => {
    const totalDocs = documents.length;
    const totalCategories = Array.from(new Set(documents.map(d => d.category))).length;
    const totalDownloads = documents.reduce((sum, d) => sum + (d.downloads || 0), 0);
    const now = new Date();
    const newDocsThisMonth = documents.filter(doc => {
      const [d, m, y] = doc.uploadDate.split('/').map(Number);
      return m === now.getMonth() + 1 && y === now.getFullYear();
    }).length;
    return { totalDocs, totalCategories, totalDownloads, newDocsThisMonth };
  }, [documents]);

  // Header navigation menu
  const menu = (
    <div className={styles.headerMenu}>
      <Button type="link" icon={<HomeOutlined />} href="/user/Home" style={{ color: '#1890ff', fontWeight: 600 }}>Trang chủ</Button>
      <Button type="link" icon={<FileSearchOutlined />} href="/user/TaiLieu" style={{ fontWeight: 600 }}>Tài liệu</Button>
      <Button type="link" icon={<BarChartOutlined />} href="/user/ThongKe" style={{ fontWeight: 600 }}>Thống kê</Button>
      <Button type="link" icon={<UploadOutlined />} href="/user/ThaoTacTaiLieu" style={{ fontWeight: 600 }}>Thao tác tài liệu</Button>
    </div>
  );

  // Avatar for user
  const handleAvatarClick = () => {
    window.location.href = '/login';
  };

  // Click notification: chuyển hướng đến TaiLieu với id/type
  const handleNotificationClick = (id: string, type: string) => {
    window.location.href = `/user/TaiLieu?id=${id}&type=${type}`;
  };

  // Notification popover component chuẩn hóa
  const notificationContent = (
    <ThongbaoPopover
      notifications={notifications}
      showNotifications={showNotifications}
      setShowNotifications={setShowNotifications}
      handleNotificationClick={handleNotificationClick}
    />
  );

  return (
    <PageContainer pageHeaderRender={false}>
      <HomeContent
        menu={menu}
        notificationContent={notificationContent}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        handleAvatarClick={handleAvatarClick}
        stats={stats}
        recentDocuments={recentDocuments}
        categoryData={categoryData}
        documents={documents} // truyền thêm prop documents
      />
    </PageContainer>
  );
};

export default HomePage;