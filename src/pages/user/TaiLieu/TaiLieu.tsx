import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Tag, Space, Button, Input, Row, Col, Typography, Divider, Modal } from 'antd';
import {
  DownloadOutlined, FilterOutlined, FileTextOutlined, SearchOutlined
} from '@ant-design/icons';
import styles from './index.less';
import FormThongTinNguoiDung from '@/components/FormThongtinnguoidung';

const { Title, Text } = Typography;

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
  totalDownloads: number; // Nhận prop này từ cha
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
  totalDownloads, // Nhận prop này từ cha
}) => {
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
        <Card bordered={false} className={styles.tableCard}>
          <Table
            columns={columns}
            dataSource={documents.filter(doc => {
              const search = searchText.trim().toLowerCase();
              const matchTitle = doc.title.toLowerCase().includes(search);
              const matchCategory = doc.category.toLowerCase().includes(search);
              return search ? (matchTitle || matchCategory) : true;
            })}
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
        <Modal
          title={previewDocument?.title}
          visible={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={[
            <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={() => handleDownload(previewDocument?.id)}>
              Tải xuống
            </Button>,
            <Button key="close" onClick={() => setPreviewVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={800}
        >
          {previewDocument && (
            <div className={styles.previewContainer}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div className={styles.previewHeader}>
                    <Space>
                      {getFileIcon(previewDocument.type)}
                      <Title level={4}>{previewDocument.title}</Title>
                    </Space>
                  </div>
                </Col>
                <Col span={24}>
                  <Divider />
                </Col>
                <Col span={12}>
                  <div className={styles.previewInfo}>
                    <p><strong>Danh mục:</strong> {previewDocument.category}</p>
                    <p><strong>Loại:</strong> {previewDocument.type}</p>
                    <p><strong>Kích thước:</strong> {previewDocument.size}</p>
                    <p><strong>Người tải lên:</strong> {previewDocument.uploadedBy}</p>
                  </div>
                </Col>
                <Col span={12}>
                  <div className={styles.previewInfo}>
                    <p><strong>Ngày tải lên:</strong> {previewDocument.uploadDate}</p>
                    <p><strong>Lượt tải:</strong> {previewDocument.downloads ?? previewDocument.downloadCount ?? 0}</p>
                    <p><strong>Trạng thái:</strong> <Tag color="green">{previewDocument.status}</Tag></p>
                  </div>
                </Col>
                <Col span={24}>
                  <Divider />
                </Col>
                <Col span={24}>
                  <div className={styles.previewDescription}>
                    <Title level={5}>Mô tả</Title>
                    <Text>{previewDocument.description}</Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div className={styles.previewFrame}>
                    {/* Placeholder for document preview */}
                    <div className={styles.previewPlaceholder}>
                      <FileTextOutlined style={{ fontSize: 64 }} />
                      <p>Bản xem trước tài liệu</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </PageContainer>
  );
};

export default TaiLieuContent;