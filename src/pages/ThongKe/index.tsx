import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, DatePicker, Statistic, Table, Space, message } from 'antd';
import { DownloadOutlined, FileExcelOutlined, PieChartOutlined, BarChartOutlined, HomeOutlined, FileSearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { TablePaginationConfig } from 'antd/es/table';
import type { Moment } from 'moment';
import { Pie, Column } from '@ant-design/charts';
import './index.less';
import {ChartDataItem, DocumentItem, UploaderStat } from '../../services/ThongKe/typings'

const { RangePicker } = DatePicker;
const { Option } = Select;

// Định nghĩa các interface
// interface ChartDataItem {
//   type: string;
//   value: number;
// }

// interface DocumentItem {
//   id: string;
//   title: string;
//   category: string;
//   uploadDate: string;
//   uploadBy: string;
//   downloads: number;
//   status: string;
// }

// interface CategoryStat {
//   category: string;
//   count: number;
//   percentage: number;
// }

// interface UploaderStat {
//   uploader: string;
//   count: number;
//   percentage: number;
// }

const StatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [chartType, setChartType] = useState<'category' | 'uploader'>('category');
  const [timeRange, setTimeRange] = useState<[Moment, Moment] | null>(null);
  const [categoryData, setCategoryData] = useState<ChartDataItem[]>([]);
  const [uploaderData, setUploaderData] = useState<ChartDataItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  // Mock data for categories
  const mockCategoryData: ChartDataItem[] = [
    { type: 'Biểu mẫu hành chính', value: 45 },
    { type: 'Văn bản quy phạm', value: 25 },
    { type: 'Quy trình nghiệp vụ', value: 18 },
    { type: 'Tài liệu đào tạo', value: 12 },
    { type: 'Toán rời rạc', value: 20 },
    { type: 'Thực hành lập trình Web', value: 15 },
    { type: 'Tiếng Anh', value: 10 },
    { type: 'Khác', value: 8 },
  ];

  // Mock data for uploaders
  const mockUploaderData: ChartDataItem[] = [
    { type: 'Nguyễn Văn A', value: 32 },
    { type: 'Trần Thị B', value: 25 },
    { type: 'Lê Văn C', value: 18 },
    { type: 'Phạm Thị D', value: 15 },
    { type: 'Hoàng Văn E', value: 12 },
    { type: 'Khác', value: 10 },
  ];

  // Mock data for documents table
  const mockDocuments: DocumentItem[] = Array(30).fill(null).map((_, index) => ({
    id: `doc-${index + 1}`,
    title: `Tài liệu ${index + 1}`,
    category: index % 4 === 0 ? 'Biểu mẫu hành chính' : 
              index % 4 === 1 ? 'Văn bản quy phạm' :
              index % 4 === 2 ? 'Quy trình nghiệp vụ' : 'Tài liệu đào tạo',
    uploadDate: `2025-05-${10 + (index % 15)}`,
    uploadBy: index % 5 === 0 ? 'Nguyễn Văn A' :
              index % 5 === 1 ? 'Trần Thị B' :
              index % 5 === 2 ? 'Lê Văn C' :
              index % 5 === 3 ? 'Phạm Thị D' : 'Hoàng Văn E',
    downloads: Math.floor(Math.random() * 100),
    status: index % 3 === 0 ? 'Đã duyệt' : 
            index % 3 === 1 ? 'Chờ duyệt' : 'Đã từ chối',
  }));

  // Tổng số tài liệu
  const totalDocuments = 100;
  // Tổng số tài liệu đã duyệt
  const totalApproved = 65;
  // Tổng số tài liệu chờ duyệt
  const totalPending = 25;
  // Tổng số tài liệu bị từ chối
  const totalRejected = 10;

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCategoryData(mockCategoryData);
      setUploaderData(mockUploaderData);
      setDocuments(mockDocuments);
      
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    message.success('Đang xuất file Excel...');
    // Xử lý xuất file Excel ở đây
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const handleTimeRangeChange = (dates: [Moment, Moment] | null) => {
    setTimeRange(dates);
    // Gọi API để lấy dữ liệu mới theo khoảng thời gian
  };

  // Cấu hình biểu đồ tròn
  const pieConfig = {
    appendPadding: 10,
    data: chartType === 'category' ? categoryData : uploaderData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };

  // Cấu hình biểu đồ cột
  const columnConfig = {
    data: chartType === 'category' ? categoryData : uploaderData,
    xField: 'type',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      type: { alias: chartType === 'category' ? 'Danh mục' : 'Người tải lên' },
      value: { alias: 'Số lượng' },
    },
  };

  // Cấu hình bảng tài liệu
  const columns = [
    {
      title: 'Tên tài liệu',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Biểu mẫu hành chính', value: 'Biểu mẫu hành chính' },
        { text: 'Văn bản quy phạm', value: 'Văn bản quy phạm' },
        { text: 'Quy trình nghiệp vụ', value: 'Quy trình nghiệp vụ' },
        { text: 'Tài liệu đào tạo', value: 'Tài liệu đào tạo' },
      ],
    },
    {
      title: 'Ngày tải lên',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      sorter: true,
    },
    {
      title: 'Người tải lên',
      dataIndex: 'uploadBy',
      key: 'uploadBy',
      filters: [
        { text: 'Nguyễn Văn A', value: 'Nguyễn Văn A' },
        { text: 'Trần Thị B', value: 'Trần Thị B' },
        { text: 'Lê Văn C', value: 'Lê Văn C' },
        { text: 'Phạm Thị D', value: 'Phạm Thị D' },
      ],
    },
    {
      title: 'Lượt tải',
      dataIndex: 'downloads',
      key: 'downloads',
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đã duyệt', value: 'Đã duyệt' },
        { text: 'Chờ duyệt', value: 'Chờ duyệt' },
        { text: 'Đã từ chối', value: 'Đã từ chối' },
      ],
    },
  ];

  // Header navigation menu
  const menu = (
    <div className="headerMenu">
      <Button type="link" icon={<HomeOutlined />} href="/TrangChu" style={{ color: '#1890ff', fontWeight: 600 }}>Trang chủ</Button>
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
    <PageContainer title={false}>
      <div className="stickyHeader">
        {menu}
        <div className="headerRight">
          <div className="avatar" onClick={handleAvatarClick} title="Đăng nhập">
            <img src={require('@/assets/admin.png')} alt="avatar" />
          </div>
        </div>
      </div>
      <div className="statisticsPage">
        {/* Thống kê tổng quan */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic 
                title="Tổng số tài liệu" 
                value={totalDocuments} 
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic 
                title="Đã duyệt" 
                value={`${Math.round((totalApproved / totalDocuments) * 100)}%`} 
                valueStyle={{ color: '#52c41a' }} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic 
                title="Chờ duyệt" 
                value={`${Math.round((totalPending / totalDocuments) * 100)}%`}
                valueStyle={{ color: '#faad14' }} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic 
                title="Đã từ chối" 
                value={`${Math.round((totalRejected / totalDocuments) * 100)}%`} 
                valueStyle={{ color: '#ff4d4f' }} 
              />
            </Card>
          </Col>
        </Row>

        {/* Bộ lọc và điều khiển */}
        <Card className="filter-card">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8} lg={6}>
              <div className="filter-item">
                <span className="filter-label">Hiển thị theo:</span>
                <Select 
                  value={chartType} 
                  onChange={(value: 'category' | 'uploader') => setChartType(value)}
                  className="filter-select"
                >
                  <Option value="category">Danh mục</Option>
                  <Option value="uploader">Người tải lên</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} md={10} lg={8}>
              <div className="filter-item">
                <span className="filter-label">Khoảng thời gian:</span>
                <RangePicker 
                  onChange={(dates) => handleTimeRangeChange(dates as [Moment, Moment] | null)}
                  className="filter-date-range"
                />
              </div>
            </Col>
            <Col xs={24} sm={24} md={6} lg={10} className="export-col">
              <Button 
                type="primary" 
                icon={<FileExcelOutlined />} 
                onClick={handleExportExcel}
                className="export-button"
              >
                Xuất Excel
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Biểu đồ */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card 
              title={
                <Space>
                  <PieChartOutlined />
                  Biểu đồ tròn
                </Space>
              } 
              className="chart-card"
            >
              <div className="chart-container">
                {console.log('Pie data:', chartType === 'category' ? categoryData : uploaderData)}
                {(chartType === 'category' ? categoryData : uploaderData).length > 0 ? (
                  <Pie {...pieConfig} />
                ) : (
                  <div style={{textAlign: 'center', color: '#aaa', paddingTop: 100}}>Không có dữ liệu để hiển thị biểu đồ tròn</div>
                )}
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card 
              title={
                <Space>
                  <BarChartOutlined />
                  Biểu đồ cột
                </Space>
              } 
              className="chart-card"
            >
              <div className="chart-container">
                <Column {...columnConfig} />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Bảng dữ liệu */}
        <Card 
          title="Danh sách tài liệu" 
          className="table-card"
          extra={
            <Button 
              type="link" 
              icon={<DownloadOutlined />} 
              onClick={handleExportExcel}
            >
              Xuất Excel
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={documents}
            rowKey="id"
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </Card>
      </div>
    </PageContainer>
  );
};

export default StatisticsPage;