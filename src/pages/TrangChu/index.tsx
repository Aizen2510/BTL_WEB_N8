import React from 'react';
import { useHistory } from 'react-router-dom';
import {Card,Col,Row,Typography,Button,Table,Divider,} from 'antd';
import {FileTextOutlined,BarChartOutlined,DownloadOutlined,} from '@ant-design/icons';
import { Bar } from '@ant-design/plots';

const { Title, Text } = Typography;

const DocumentDashboard: React.FC = () => {
  const history = useHistory();

  // Lấy dữ liệu từ localStorage
  const documents = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('data') || '[]');
    } catch {
      return [];
    }
  }, []);
  const categories = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('categories') || '[]');
    } catch {
      return [];
    }
  }, []);

  // Tổng số tài liệu đã duyệt
  const totalDocuments = documents.filter((doc: any) => doc.isApproved === 'approved').length;
  // Tổng số danh mục
  const totalCategories = categories.length;

  // Thống kê trạng thái duyệt
  const approvedStatus = documents.reduce(
    (acc: any, item: any) => {
      if (item.isApproved === 'approved') acc.approved++;
      else if (item.isApproved === 'rejected') acc.refused++;
      else acc.pending++;
      return acc;
    },
    { approved: 0, pending: 0, refused: 0 }
  );
  const pieStatusData = [
    { type: 'Đã duyệt', value: approvedStatus.approved },
    { type: 'Chờ duyệt', value: approvedStatus.pending },
    { type: 'Từ chối', value: approvedStatus.refused },
  ];

  // Top 5 lượt tải
  const topDownloads = [...documents]
    .filter((doc: any) => doc.isApproved === 'approved')
    .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
    .slice(0, 5)
    .map(doc => ({ name: doc.title, value: doc.downloadCount || 0 }));

  // Thống kê theo danh mục
  const categoryStats = categories.map((cat: any) => {
    const docsInCat = documents.filter((doc: any) => doc.categoryId === cat.categoryId && doc.isApproved === 'approved');
    return {
      categoryName: cat.categoryName,
      totalDocuments: docsInCat.length,
      totalDownloads: docsInCat.reduce((sum: any, doc: any) => sum + (doc.downloadCount || 0), 0),
    };
  });

  const statusColumns = [
    { title: 'Trạng thái', dataIndex: 'type', key: 'type' },
    { title: 'Số lượng', dataIndex: 'value', key: 'value' },
  ];

  const topDownloadColumns = [
    { title: 'Tên tài liệu', dataIndex: 'name', key: 'name' },
    { title: 'Lượt tải', dataIndex: 'value', key: 'value' },
  ];

  const chartData = categoryStats.map((item: any) => ({
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
      <Title level={3}>TỔNG QUAN TÀI LIỆU</Title>

      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Card title="Tổng số tài liệu" bordered>
            <Text strong style={{ fontSize: 28, color: '#1890ff' }}>{totalDocuments}</Text>
            <Divider />
            <Text type="secondary">Tổng hợp toàn bộ tài liệu đã duyệt</Text>
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
              dataSource={topDownloads}
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
              onClick={() => history.push('/documentmanaget/upload')}
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
