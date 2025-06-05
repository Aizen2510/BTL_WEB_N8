import React from 'react';
import TaiLieuContent from './TaiLieu';
import styles from './index.less';
import {
  DownloadOutlined,
  EyeOutlined,
  BookOutlined,
  FileWordOutlined,
  FilePptOutlined,
  FileExcelOutlined,
  FileUnknownOutlined,
  MoreOutlined,
  HomeOutlined,
  FileSearchOutlined,
  BarChartOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Tag, Space, Dropdown, Menu } from 'antd';
import ThongbaoPopover from '@/components/Thongbao';
import useTaiLieuModel from '@/models/TaiLieu';

const DocumentsPage: React.FC = () => {
  // Lấy toàn bộ state và logic từ model
  const {
    documents,
    setDocuments,
    loading,
    setLoading,
    searchText,
    setSearchText,
    selectedType,
    setSelectedType,
    previewVisible,
    setPreviewVisible,
    previewDocument,
    setPreviewDocument,
    categories,
    documentTypes,
    showNotifications,
    setShowNotifications,
    notifications,
  } = useTaiLieuModel();

  // Tính tổng số lượt tải xuống của tất cả tài liệu (ưu tiên downloads, fallback downloadCount)
  const totalDownloads = documents.reduce(
    (sum, doc) => sum + (doc.downloads || doc.downloadCount || 0),
    0
  );

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <BookOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />;
      case 'DOCX':
        return <FileWordOutlined style={{ color: '#1890ff', fontSize: 18 }} />;
      case 'PPTX':
        return <FilePptOutlined style={{ color: '#fa8c16', fontSize: 18 }} />;
      case 'XLSX':
        return <FileExcelOutlined style={{ color: '#52c41a', fontSize: 18 }} />;
      default:
        return <FileUnknownOutlined style={{ color: '#8c8c8c', fontSize: 18 }} />;
    }
  };

  // Handle preview document
  const handlePreview = (document: any) => {
    setPreviewDocument(document);
    setPreviewVisible(true);
  };

  // Handle document download
  const handleDownload = (id: number) => {
    const doc = documents.find((d) => d.id === id);
    if (doc && doc.fileUrl) {
      try {
        const { incrementDownloadCount } = require('@/services/ThaoTacTaiLieu/index');
        incrementDownloadCount(String(id));
        setDocuments((prevDocs: any[]) =>
          prevDocs.map((d) =>
            d.id === id ? { ...d, downloads: (d.downloads || 0) + 1 } : d
          )
        );
      } catch (e) {}
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.title || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle filter change
  const handleFilterChange = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchText('');
    setSelectedType(null);
  };

  // Configure table columns
  const columns = [
    {
      title: 'Tài liệu',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <Space>
          {getFileIcon(record.type)}
          <a onClick={() => handlePreview(record)}>{text}</a>
        </Space>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Người đăng tải',
      dataIndex: 'uploadedBy',
      key: 'uploadedBy',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Ngày tải lên',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      sorter: (a: any, b: any) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime(),
    },
    {
      title: 'Lượt tải',
      dataIndex: 'downloads',
      key: 'downloads',
      sorter: (a: any, b: any) => (a.downloads || a.downloadCount || 0) - (b.downloads || b.downloadCount || 0),
      render: (_: any, record: any) => record.downloads ?? record.downloadCount ?? 0,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
            title="Xem trước"
          />
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.id)}
            title="Tải xuống"
          />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1">Xem chi tiết</Menu.Item>
                <Menu.Item key="2">Chia sẻ</Menu.Item>
                <Menu.Item key="3">Báo cáo</Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Header navigation menu
  const menu = (
    <div className={styles.headerMenu}>
      <Button type="link" icon={<HomeOutlined />} href="/user/Home" style={{ fontWeight: 600 }}>Trang chủ</Button>
      <Button type="link" icon={<FileSearchOutlined />} href="/user/TaiLieu" style={{ color: '#1890ff', fontWeight: 600 }}>Tài liệu</Button>
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

  return (
    <TaiLieuContent
      menu={menu}
      notificationContent={
        <ThongbaoPopover
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          handleNotificationClick={handleNotificationClick}
        />
      }
      showNotifications={showNotifications}
      setShowNotifications={setShowNotifications}
      handleAvatarClick={handleAvatarClick}
      searchText={searchText}
      setSearchText={setSearchText}
      selectedType={selectedType}
      setSelectedType={setSelectedType}
      categories={categories}
      documentTypes={documentTypes}
      handleFilterChange={handleFilterChange}
      resetFilters={resetFilters}
      columns={columns}
      documents={documents}
      loading={loading}
      previewVisible={previewVisible}
      setPreviewVisible={setPreviewVisible}
      previewDocument={previewDocument}
      handlePreview={handlePreview}
      handleDownload={handleDownload}
      getFileIcon={getFileIcon}
      totalDownloads={totalDownloads}
    />
  );
};

export default DocumentsPage;