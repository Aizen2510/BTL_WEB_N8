import React from 'react';
import { useHistory } from 'react-router-dom';
import {Card,Col,Row,Typography,Button,Table,Divider,} from 'antd';
import {FileTextOutlined,BarChartOutlined,DownloadOutlined,} from '@ant-design/icons';
import { Bar } from '@ant-design/plots';

import { useModel } from 'umi';

const { Title, Text } = Typography;

const DocumentDashboard: React.FC = () => {
  const history = useHistory();
  const {categoryStats = [],fileTypeStats = [],excelExportRows = [],chartTopDownload = [],} = useModel('documentReportState');

  const mockTopDownloads = [
    { name: 'Giáo trình Toán cao cấp', value: 18 },
    { name: 'Slide Vật lý đại cương', value: 14 },
    { name: 'Bài tập Giải tích', value: 12 },
    { name: 'Đề thi Kỹ thuật số', value: 10 },
    { name: 'Bài giảng Hóa học', value: 9 },
  ];

  const approvedStatus = excelExportRows.length
    ? excelExportRows.reduce(
        (acc, item) => {
          if (item.status === 'Đã duyệt') acc.approved++;
          else if (item.status === 'Từ chối') acc.refused++;
          else acc.pending++;
          return acc;
        },
        { approved: 0, pending: 0, refused: 0 }
      )
    : { approved: 10, pending: 3, refused: 1 }; // mock

  const pieStatusData = [
    { type: 'Đã duyệt', value: approvedStatus.approved },
    { type: 'Chờ duyệt', value: approvedStatus.pending },
    { type: 'Từ chối', value: approvedStatus.refused },
  ];

  const mockCategoryStats = [
    { categoryName: 'Giáo trình', totalDocuments: 12, totalDownloads: 45 },
    { categoryName: 'Bài giảng', totalDocuments: 8, totalDownloads: 27 },
    { categoryName: 'Đề thi', totalDocuments: 5, totalDownloads: 19 },
  ];

  const usedTopDownloads = chartTopDownload.length ? chartTopDownload : mockTopDownloads;
  const usedCategoryStats = categoryStats.length ? categoryStats : mockCategoryStats;

  const totalDocuments = usedCategoryStats.reduce((sum, item) => sum + item.totalDocuments, 0);

  const statusColumns = [
    { title: 'Trạng thái', dataIndex: 'type', key: 'type' },
    { title: 'Số lượng', dataIndex: 'value', key: 'value' },
  ];

  const topDownloadColumns = [
    { title: 'Tên tài liệu', dataIndex: 'name', key: 'name' },
    { title: 'Lượt tải', dataIndex: 'value', key: 'value' },
  ];

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
          <Card title="Trạng thái duyệt tài liệu" bordered>
            <Table
              dataSource={pieStatusData}
              columns={statusColumns}
              pagination={false}
              size="small"
              rowKey="type"
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
          <Card title="Biểu đồ tổng quan theo danh mục">
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
