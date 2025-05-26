import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Card,
  Col,
  Row,
  Typography,
  Button,
  Table,
  Divider,
} from 'antd';
import {
  FileTextOutlined,
  BarChartOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { Bar } from '@ant-design/plots';

import { useModel } from 'umi';

const { Title, Text } = Typography;

const DocumentDashboard: React.FC = () => {
  const history = useHistory();
  const {
    categoryStats = [],
    fileTypeStats = [],
    chartTopDownload = [],
  } = useModel('documentReportState');
  
  // Mock khi không có dữ liệu thật
    const mockFileTypeStats = [
    { fileType: 'PDF', totalDocuments: 10 },
    { fileType: 'DOCX', totalDocuments: 7 },
    { fileType: 'PPTX', totalDocuments: 8 },
  ];

  const mockTopDownloads = [
    { name: 'Giáo trình Toán cao cấp', value: 18 },
    { name: 'Slide Vật lý đại cương', value: 14 },
    { name: 'Bài tập Giải tích', value: 12 },
    { name: 'Đề thi Kỹ thuật số', value: 10 },
    { name: 'Bài giảng Hóa học', value: 9 },
  ];

  const mockCategoryStats = [
    { categoryName: 'Giáo trình', totalDocuments: 12, totalDownloads: 45 },
    { categoryName: 'Bài giảng', totalDocuments: 8, totalDownloads: 27 },
    { categoryName: 'Đề thi', totalDocuments: 5, totalDownloads: 19 },
  ];

  const usedFileTypeStats = fileTypeStats.length ? fileTypeStats : mockFileTypeStats;
  const usedTopDownloads = chartTopDownload.length ? chartTopDownload : mockTopDownloads;
  const usedCategoryStats = categoryStats.length ? categoryStats : mockCategoryStats;

  // Tổng tài liệu
  const totalDocuments = usedCategoryStats.reduce((sum, item) => sum + item.totalDocuments, 0);

  // Table columns
  const fileTypeColumns = [
    { title: 'Định dạng', dataIndex: 'fileType', key: 'fileType' },
    { title: 'Số lượng', dataIndex: 'totalDocuments', key: 'totalDocuments' },
  ];

  const topDownloadColumns = [
    { title: 'Tên tài liệu', dataIndex: 'name', key: 'name' },
    { title: 'Lượt tải', dataIndex: 'value', key: 'value' },
  ];

  // Biểu đồ danh mục
  const chartData = usedCategoryStats.map(item => ({
    category: item.categoryName,
    value: item.totalDocuments,
    type: 'Số tài liệu',
  }));

  const barCategoryGroupedConfig = {
    data: chartData,
    isGroup: true,
    xField: 'category',
    yField: 'value',
    seriesField: 'type',
    legend: { position: 'top-right' as const },
  };
  
  return (
    <div className="p-4">
      <Title level={3}>Tổng Quan Tài Liệu</Title>

      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Card title="Tổng số tài liệu" bordered>
            <Text strong style={{ fontSize: 28, color: '#1890ff' }}>{totalDocuments}</Text>
            <Divider />
            <Text type="secondary">Tổng hợp toàn bộ tài liệu đã đăng</Text>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Tài liệu theo định dạng">
            <Table
              dataSource={usedFileTypeStats}
              columns={fileTypeColumns}
              pagination={false}
              size="small"
              rowKey="fileType"
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Top 5 lượt tải">
            <Table
              dataSource={usedTopDownloads}
              columns={topDownloadColumns}
              pagination={false}
              size="small"
              rowKey="name"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Card
            title="Biểu đồ tổng quan theo danh mục"
          >
            <Bar {...barCategoryGroupedConfig} height={300} />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Hành động nhanh">
            <Button
              icon={<FileTextOutlined />}
              block
              type="primary"
              className="mb-2"
            >
              Xem danh sách tài liệu
            </Button>
            <Button
              icon={<BarChartOutlined />}
              block
              className="mb-2"
              style={{ backgroundColor: '#52c41a', color: '#fff' }}
              onClick={() => history.push('/report')}
            >
              Xem báo cáo chi tiết
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DocumentDashboard;
