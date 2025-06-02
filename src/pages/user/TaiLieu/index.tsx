import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Typography,
  Tooltip,
  Dropdown,
  Menu,
  Divider,
  Modal,
} from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  FilterOutlined,
  FileTextOutlined,
  BookOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FilePptOutlined,
  EyeOutlined,
  FileUnknownOutlined,
  MoreOutlined,
  HomeOutlined,
  FileSearchOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { getDocuments, getCategories } from '@/services/ThaoTacTaiLieu/index';
import type { Document, Category } from '@/services/ThaoTacTaiLieu/typings';
import styles from './index.less';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);

  useEffect(() => {
    // Lấy dữ liệu thật từ localStorage
    const docs: Document[] = getDocuments();
    const cats: Category[] = getCategories();
    setCategories(cats.map(c => c.name));
    // Lấy các loại fileType duy nhất
    const types = Array.from(new Set(docs.map(d => d.fileType && d.fileType.toUpperCase ? d.fileType.toUpperCase() : 'Khác')));
    setDocumentTypes(types.length ? types : ['PDF', 'DOCX', 'PPTX', 'XLSX', 'Khác']);
    // Chuyển đổi dữ liệu cho bảng
    setDocuments(docs.map(doc => ({
      id: doc.id,
      title: doc.title,
      category: cats.find(c => c.id === doc.category)?.name || doc.category,
      subcategory: '',
      type: doc.fileType && doc.fileType.toUpperCase ? doc.fileType.toUpperCase() : 'Khác',
      size: doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(1)} MB` : '',
      uploadedBy: doc.uploadedBy,
      uploadDate: doc.uploadDate,
      downloads: doc.downloadCount,
      status: doc.status === 'approved' ? 'Đã duyệt' : doc.status === 'pending' ? 'Chờ duyệt' : 'Đã từ chối',
      description: doc.description,
      fileUrl: doc.fileUrl,
    })));
  }, []);

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
    console.log(`Downloading document with ID: ${id}`);
    // In a real app, this would trigger a file download
  };

  // Handle filter change
  const handleFilterChange = () => {
    setLoading(true);
    // Simulate API call with filters
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchText('');
    setSelectedCategory(null);
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        let color = 'green';
        if (text === 'Chờ duyệt') color = 'orange';
        if (text === 'Đã từ chối') color = 'red';
        return <Tag color={color}>{text}</Tag>;
      },
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
      sorter: (a: any, b: any) => a.downloads - b.downloads,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Xem trước">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="Tải xuống">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record.id)}
            />
          </Tooltip>
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
      <Button type="link" icon={<FileSearchOutlined />} href="/user/TaiLieu" style={{  color: '#1890ff', fontWeight: 600 }}>Tài liệu</Button>
      <Button type="link" icon={<BarChartOutlined />} href="/user/ThongKe" style={{ fontWeight: 600 }}>Thống kê</Button>
      <Button type="link" icon={<UploadOutlined />} href="/user/ThaoTacTaiLieu" style={{ fontWeight: 600 }}>Thao tác tài liệu</Button>
    </div>
  );

  // Avatar for user
  const handleAvatarClick = () => {
    window.location.href = '/login';
  };

  return (
    <PageContainer pageHeaderRender={false}>
      <div className={styles.stickyHeader}>
        {menu}
        <div className={styles.headerRight}>
          <div className={styles.avatar} onClick={handleAvatarClick} title="Đăng nhập">
            <img src={require('@/assets/admin.png')} alt="avatar" />
          </div>
        </div>
      </div>
      <div className={styles.documentsContainer}>
        {/* Filters section */}
        <Card bordered={false} className={styles.filterCard}>
          <Row gutter={16}>
            <Col span={8}>
              <Input
                placeholder="Tìm kiếm tài liệu"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col span={5}>
              <Select
                placeholder="Danh mục"
                style={{ width: '100%' }}
                allowClear
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
              >
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="Loại tài liệu"
                style={{ width: '100%' }}
                allowClear
                value={selectedType}
                onChange={(value) => setSelectedType(value)}
              >
                {documentTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={7}>
              <Space>
                <RangePicker
                  placeholder={['Từ ngày', 'Đến ngày']}
                />
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
            dataSource={documents}
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
                    <p><strong>Lượt tải:</strong> {previewDocument.downloads}</p>
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

export default DocumentsPage;