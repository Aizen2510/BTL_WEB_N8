import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Tag, Space, Button, Input, Row, Col, Typography, Divider, Modal } from 'antd';
import {
  DownloadOutlined, FilterOutlined, FileTextOutlined, SearchOutlined
} from '@ant-design/icons';
import styles from './index.less';
import FormThongTinNguoiDung from '@/components/FormThongtinnguoidung';
import { useModel } from 'umi';

interface TaiLieuContentProps {
  menu: React.ReactNode;
  notificationContent: React.ReactNode;
  showNotifications: boolean;
  setShowNotifications: (open: boolean) => void;
  handleAvatarClick: () => void;
  searchText: string;
  setSearchText: (v: string) => void;
  selectedType: string | null;
  setSelectedType: (v: string | null) => void;
  categories: string[];
  documentTypes: string[];
  handleFilterChange: () => void;
  resetFilters: () => void;
  columns: any[];
  documents: any[];
  loading: boolean;
  previewVisible: boolean;
  setPreviewVisible: (v: boolean) => void;
  previewDocument: any;
  handlePreview: (doc: any) => void;
  handleDownload: (id: number) => void;
  getFileIcon: (type: string) => React.ReactNode;
  totalDownloads: number;
}

const TaiLieuContent: React.FC<TaiLieuContentProps> = ({
  menu,
  notificationContent,
  showNotifications,
  setShowNotifications,
  handleAvatarClick,
  searchText,
  setSearchText,
  selectedType,
  setSelectedType,
  categories,
  documentTypes,
  handleFilterChange,
  resetFilters,
  columns,
  documents,
  loading,
  previewVisible,
  setPreviewVisible,
  previewDocument,
  handlePreview,
  handleDownload,
  getFileIcon,
  totalDownloads,
}) => {
  const {filteredData} = useModel('documentManager');
  
  // Lấy danh mục từ localStorage
  const [categoryList, setCategoryList] = useState<string[]>([]);
  
  useEffect(() => {
    try {
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories);
        setCategoryList(parsedCategories.map((cat: any) => cat.categoryName));
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    }
  }, []);

  // Hàm xử lý khi click vào danh mục
  const handleCategoryClick = (category: string) => {
    setSearchText(category);
    handleFilterChange();
  };

  return (
    <PageContainer pageHeaderRender={false}>
      <div className={styles.stickyHeader}>
        {menu}
        <div className={styles.headerRight}>
          {/* Thông báo */}
          {notificationContent}
          {/* Avatar dropdown, truyền đúng số lượt tải xuống */}
          <FormThongTinNguoiDung totalDownloads={totalDownloads} />
        </div>
      </div>
      <div className={styles.documentsContainer}>
        {/* Filters section */}
        <Card bordered={false} className={styles.filterCard}>
          <Row gutter={16}>
            <Col span={16}>
              <Input
                placeholder="Tìm kiếm tài liệu hoặc danh mục"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
                onPressEnter={handleFilterChange}
              />
            </Col>
            <Col span={8}>
              <Space>
                <Button type="primary" icon={<FilterOutlined />} onClick={handleFilterChange}>
                  Lọc
                </Button>
                <Button onClick={resetFilters}>Đặt lại</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Documents table */}
        <Card bordered={false} className={styles.tableCard} style={{ marginTop: 16 }}>
          <Table
            columns={columns}
            dataSource={filteredData.filter(doc => doc.isApproved === 'approved')}
            rowKey="id"
            loading={loading}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `Tổng cộng ${total} tài liệu`,
            }}
          />
        </Card>
        {/* Document preview modal */}
      </div>
    </PageContainer>
  );
};

export default TaiLieuContent;