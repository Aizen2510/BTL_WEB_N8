import React, { useState, useEffect } from 'react';
import TaiLieuContent from './TaiLieu';
import styles from './index.less';
import type { IColumn } from '@/components/Table/typing';
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
import { Button, Tag, Space } from 'antd';
import useTaiLieuModel from '@/models/TaiLieu';
import useUserNotification from '@/models/userNotification';
import NoticeIcon from '@/components/RightContent/NoticeIcon';

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
  } = useTaiLieuModel();

  // Lấy userId hiện tại (giả sử lưu trong localStorage)
  const currentUserId = localStorage.getItem('currentUserId') || '';
  const { notifications, unread, markAllAsRead } = useUserNotification();

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
        // Cập nhật số lượt tải trong localStorage
        const rawData = localStorage.getItem('data') || '[]';
        const allDocs = JSON.parse(rawData);
        const updatedDocs = allDocs.map((d: any) => {
          if (d.id === id) {
            return {
              ...d,
              downloads: (d.downloads || 0) + 1,
              downloadCount: (d.downloadCount || 0) + 1
            };
          }
          return d;
        });
        localStorage.setItem('data', JSON.stringify(updatedDocs));

        // Cập nhật state
        setDocuments((prevDocs: any[]) =>
          prevDocs.map((d) =>
            d.id === id ? { ...d, downloads: (d.downloads || 0) + 1, downloadCount: (d.downloadCount || 0) + 1 } : d
          )
        );
      } catch (error) {
        console.error('Lỗi khi tải xuống:', error);
      }
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
  const columns: IColumn<Document.Record>[] = [
      { title: 'Tên Tài Liệu', dataIndex: 'title', key: 'title', width: 150 },
      {
        title: 'Danh Mục',
        dataIndex: 'categoryId',
        key: 'categoryId',
        width: 100,
        render: (categoryId: string) => {
          const cats = JSON.parse(localStorage.getItem('categories') || '[]');
          const found = cats.find((cat: any) => cat.categoryId === categoryId || cat.id === categoryId);
          return found ? (found.categoryName || found.name) : categoryId;
        }
      },
      { title: 'Người Đăng', dataIndex: 'uploaderName', key: 'uploaderName', width: 120 },
      { title: 'Mô Tả', dataIndex: 'description', key: 'description', width: 250 },
      { title: 'Ngày Đăng', dataIndex: 'uploadDate', key: 'uploadDate', width: 150 },
      { 
        title: 'Lượt Tải', 
        dataIndex: 'downloadCount', 
        key: 'downloadCount', 
        width: 50,
        sorter: (a: any, b: any) => (a.downloads || a.downloadCount || 0) - (b.downloads || b.downloadCount || 0),
        render: (_: any, record: any) => record.downloads ?? record.downloadCount ?? 0
      },
      {
        title: 'File',
        dataIndex: 'fileUrl',
        key: 'fileUrl',
        align: 'center',
        width: 120,
        render: (text, record) => {
          const filePath = record.fileUrl
            ? record.fileUrl.replace('http://localhost:3000/uploads/', '')
            : '';
          return record.fileUrl ? (
            <a
              href={`http://localhost:3000/download/${encodeURIComponent(filePath)}`}
              onClick={() => handleDownload(Number(record.id))}
            >
              <Button icon={<DownloadOutlined />} />
            </a>
          ) : (
            'Chưa có file'
          );
        },
      },
  ];

  // Header navigation menu
  const menu = (
    <div className={styles.headerMenu}>
      <Button type="link" icon={<HomeOutlined />} href="/user/Home" style={{fontWeight: 600 }}>Trang chủ</Button>
      <Button type="link" icon={<FileSearchOutlined />} href="/user/TaiLieu" style={{ fontWeight: 600 }}>Tài liệu</Button>
      <Button type="link" icon={<FileSearchOutlined />} href="/user/DanhMuc" style={{ fontWeight: 600 }}>Danh mục</Button>
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

  function getDocumentsWithCategoryName() {
    const localCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    let localDocuments = JSON.parse(localStorage.getItem('documents') || '[]');
    localDocuments = localDocuments.map((doc: any) => {
      if (!doc.categoryName) {
        const found = localCategories.find(
          (cat: any) => cat.categoryId === doc.categoryId || cat.id === doc.categoryId
        );
        return {
          ...doc,
          categoryName: found ? (found.categoryName || found.name) : doc.categoryId,
        };
      }
      return doc;
    });
    return localDocuments;
  }

  useEffect(() => {
    setDocuments(getDocumentsWithCategoryName());
  }, []);

  return (
    <TaiLieuContent
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