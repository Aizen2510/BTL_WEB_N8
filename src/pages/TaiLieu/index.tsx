import React, { useState } from 'react';
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
import styles from './index.less';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const DocumentsPage: React.FC = () => {
  const [documents] = useState([
    {
      id: 1,
      title: 'Giáo trình Lập trình Web',
      category: 'Công nghệ thông tin',
      subcategory: 'Lập trình Web',
      type: 'PDF',
      size: '5.2 MB',
      uploadedBy: 'TS. Nguyễn Văn A',
      uploadDate: '2025-05-10',
      downloads: 156,
      status: 'Đã duyệt',
      description: 'Giáo trình dành cho sinh viên năm 3 ngành Công nghệ thông tin',
    },
    {
      id: 2,
      title: 'Bài giảng Cơ sở dữ liệu',
      category: 'Công nghệ thông tin',
      subcategory: 'Cơ sở dữ liệu',
      type: 'PPTX',
      size: '3.7 MB',
      uploadedBy: 'TS. Trần Thị B',
      uploadDate: '2025-05-08',
      downloads: 89,
      status: 'Đã duyệt',
      description: 'Bài giảng về các khái niệm cơ bản trong cơ sở dữ liệu',
    },
    {
      id: 3,
      title: 'Tài liệu Thiết kế UI/UX',
      category: 'Thiết kế',
      subcategory: 'UI/UX',
      type: 'PDF',
      size: '8.1 MB',
      uploadedBy: 'ThS. Lê Văn C',
      uploadDate: '2025-05-07',
      downloads: 204,
      status: 'Đã duyệt',
      description: 'Tài liệu tham khảo về nguyên tắc thiết kế giao diện người dùng',
    },
    {
      id: 4,
      title: 'Hướng dẫn đồ án tốt nghiệp',
      category: 'Khoa học máy tính',
      subcategory: 'Đồ án',
      type: 'DOCX',
      size: '2.5 MB',
      uploadedBy: 'PGS.TS. Phạm Văn D',
      uploadDate: '2025-05-05',
      downloads: 123,
      status: 'Đã duyệt',
      description: 'Hướng dẫn chi tiết cách thực hiện đồ án tốt nghiệp',
    },
    {
      id: 5,
      title: 'Bài tập môn Trí tuệ nhân tạo',
      category: 'Công nghệ thông tin',
      subcategory: 'Trí tuệ nhân tạo',
      type: 'PDF',
      size: '1.8 MB',
      uploadedBy: 'TS. Nguyễn Văn A',
      uploadDate: '2025-05-04',
      downloads: 178,
      status: 'Đã duyệt',
      description: 'Tập hợp các bài tập về Machine Learning và Deep Learning',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);

  // Mock categories data
  const categories = [
    'Công nghệ thông tin',
    'Khoa học máy tính',
    'Thiết kế',
    'Kinh tế',
    'Ngoại ngữ',
  ];

  // Mock document types
  const documentTypes = ['PDF', 'DOCX', 'PPTX', 'XLSX', 'Khác'];

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
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
    {
      title: 'Kích thước',
      dataIndex: 'size',
      key: 'size',
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
      <Button type="link" icon={<HomeOutlined />} href="/Trangchu" style={{ color: '#1890ff', fontWeight: 600 }}>Trang chủ</Button>
      <Button type="link" icon={<FileSearchOutlined />} href="/TaiLieu" style={{ fontWeight: 600 }}>Tài liệu</Button>
      <Button type="link" icon={<BarChartOutlined />} href="/ThongKe" style={{ fontWeight: 600 }}>Thống kê</Button>
      <Button type="link" href="/ThemTaiLieu" style={{ fontWeight: 600 }}>Thêm tài liệu</Button>
      <Button type="link" href="/DuyetTaiLieu" style={{ fontWeight: 600 }}>Duyệt tài liệu</Button>
    </div>
  );

  // Avatar for user
  const handleAvatarClick = () => {
    window.location.href = '/user/login';
  };

  return (
    <PageContainer header={false}>
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