import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, DatePicker, Statistic, Table, Space, message } from 'antd';
import { UploadOutlined, DownloadOutlined, FileExcelOutlined, PieChartOutlined, BarChartOutlined, HomeOutlined, FileSearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { TablePaginationConfig } from 'antd/es/table';
import type { Moment } from 'moment';
import { Pie, Column } from '@ant-design/charts';
import './index.less';
import { getDocuments } from '@/services/ThaoTacTaiLieu/index';
import type { Document } from '@/services/ThaoTacTaiLieu/typings';

const { RangePicker } = DatePicker;
const { Option } = Select;

// Định nghĩa các interface
interface ChartDataItem {
  type: string;
  value: number;
}

interface DocumentItem {
  id: string;
  title: string;
  category: string;
  uploadDate: string;
  uploadBy: string;
  downloads: number;
  status: string;
}

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

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Lấy dữ liệu thật từ localStorage
      const docs: Document[] = getDocuments();
      // Lọc theo khoảng thời gian nếu có
      let filteredDocs = docs;
      if (timeRange) {
        const [start, end] = timeRange;
        filteredDocs = docs.filter(doc => {
          // uploadDate dạng DD/MM/YYYY
          const [d, m, y] = doc.uploadDate.split('/').map(Number);
          const docDate = new Date(y, m - 1, d);
          return docDate >= start.toDate() && docDate <= end.toDate();
        });
      }

      // Chuyển sang DocumentItem cho bảng
      const docItems: DocumentItem[] = filteredDocs.map(doc => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        uploadDate: doc.uploadDate,
        uploadBy: doc.uploadedBy,
        downloads: doc.downloadCount,
        status: doc.status === 'approved' ? 'Đã duyệt' : doc.status === 'pending' ? 'Chờ duyệt' : 'Đã từ chối',
      }));
      setDocuments(docItems);

      // Thống kê tổng số
      const totalDocuments = filteredDocs.length;
      const totalApproved = filteredDocs.filter(d => d.status === 'approved').length;
      const totalPending = filteredDocs.filter(d => d.status === 'pending').length;
      const totalRejected = filteredDocs.filter(d => d.status === 'rejected').length;
      // Lưu vào state để hiển thị
      (StatisticsPage as any).totalDocuments = totalDocuments;
      (StatisticsPage as any).totalApproved = totalApproved;
      (StatisticsPage as any).totalPending = totalPending;
      (StatisticsPage as any).totalRejected = totalRejected;

      // Thống kê theo danh mục
      const categoryMap: Record<string, number> = {};
      filteredDocs.forEach(doc => {
        const catName = doc.category;
        categoryMap[catName] = (categoryMap[catName] || 0) + 1;
      });
      const categoryChart: ChartDataItem[] = Object.entries(categoryMap).map(([type, value]) => ({ type, value }));
      setCategoryData(categoryChart);

      // Thống kê theo người đăng
      const uploaderMap: Record<string, number> = {};
      filteredDocs.forEach(doc => {
        uploaderMap[doc.uploadedBy] = (uploaderMap[doc.uploadedBy] || 0) + 1;
      });
      const uploaderChart: ChartDataItem[] = Object.entries(uploaderMap).map(([type, value]) => ({ type, value }));
      setUploaderData(uploaderChart);
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
      <Button type="link" icon={<HomeOutlined />} href="/user/Home" style={{ color: '#1890ff', fontWeight: 600 }}>Trang chủ</Button>
      <Button type="link" icon={<FileSearchOutlined />} href="/user/TaiLieu" style={{ fontWeight: 600 }}>Tài liệu</Button>
      <Button type="link" icon={<BarChartOutlined />} href="/user/ThongKe" style={{ fontWeight: 600 }}>Thống kê</Button>
      <Button type="link" icon={<UploadOutlined />} href="/user/ThaoTacTaiLieu" style={{ fontWeight: 600 }}>Thao tác tài liệu</Button>
    </div>
  );

  // Avatar for user
  const handleAvatarClick = () => {
    window.location.href = '/user/login';
  };

  // Thay các biến tổng số liệu bằng dữ liệu thực tế
  const totalDocuments = (StatisticsPage as any).totalDocuments || 0;
  const totalApproved = (StatisticsPage as any).totalApproved || 0;
  const totalPending = (StatisticsPage as any).totalPending || 0;
  const totalRejected = (StatisticsPage as any).totalRejected || 0;

  return (
    <PageContainer pageHeaderRender={false}>
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
                {(pieConfig.data && pieConfig.data.length > 0) ? (
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