import React from 'react';
import { Card, Row, Col, Select, Button, DatePicker, Statistic, Table, Space } from 'antd';
import { UploadOutlined, DownloadOutlined, FileExcelOutlined, PieChartOutlined, BarChartOutlined, HomeOutlined, FileSearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Pie, Column } from '@ant-design/charts';
import './index.less';

interface ThongKeContentProps {
  menu: React.ReactNode;
  notificationContent: React.ReactNode;
  showNotifications: boolean;
  setShowNotifications: (open: boolean) => void;
  handleAvatarClick: () => void;
  totalDocuments: number;
  totalApproved: number;
  totalPending: number;
  totalRejected: number;
  chartType: 'category' | 'uploader';
  setChartType: (v: 'category' | 'uploader') => void;
  timeRange: any;
  handleTimeRangeChange: (dates: any) => void;
  handleExportExcel: () => void;
  pieConfig: any;
  columnConfig: any;
  columns: any[];
  documents: any[];
  pagination: any;
  loading: boolean;
  handleTableChange: (pagination: any) => void;
}

const ThongKeContent: React.FC<ThongKeContentProps> = ({
  menu,
  notificationContent,
  showNotifications,
  setShowNotifications,
  handleAvatarClick,
  totalDocuments,
  totalApproved,
  totalPending,
  totalRejected,
  chartType,
  setChartType,
  timeRange,
  handleTimeRangeChange,
  handleExportExcel,
  pieConfig,
  columnConfig,
  columns,
  documents,
  pagination,
  loading,
  handleTableChange,
}) => (
  <PageContainer pageHeaderRender={false}>
    <div className="stickyHeader">
      {menu}
      <div className="headerRight">
        {/* Thay thế Popover Bell bằng notificationContent truyền từ ngoài vào */}
        {notificationContent}
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
              value={`${totalDocuments ? Math.round((totalApproved / totalDocuments) * 100) : 0}%`}  
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic 
              title="Chờ duyệt" 
              value={`${totalDocuments ? Math.round((totalPending / totalDocuments) * 100) : 0}%`} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic 
              title="Đã từ chối" 
              value={`${totalDocuments ? Math.round((totalRejected / totalDocuments) * 100) : 0}%`} 
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
                onChange={setChartType}
                className="filter-select"
              >
                <Select.Option value="category">Danh mục</Select.Option>
                <Select.Option value="uploader">Người tải lên</Select.Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={10} lg={8}>
            <div className="filter-item">
              <span className="filter-label">Khoảng thời gian:</span>
              <DatePicker.RangePicker 
                onChange={handleTimeRangeChange}
                className="filter-date-range"
                value={timeRange}
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

export default ThongKeContent;
