import React from 'react';
import { Row, Col, Card, Typography, Button } from 'antd';
import { Pie, Bar } from '@ant-design/plots';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;

const DashboardOverview: React.FC = () => {
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

  const pieConfig = {
    data: pieStatusData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner' as const,
      offset: '-30%',
      content: '{value}',
      style: { fontSize: 14, textAlign: 'center', radius: 0.9 },
    },
    legend: true,
    color: ['#16AC66', '#F0C514', '#FF4D4F'],
  };

  // Top 5 lượt tải
  const topDownloads = [...documents]
    .filter((doc: any) => doc.isApproved === 'approved')
    .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
    .slice(0, 5)
    .map(doc => ({ name: doc.title, value: doc.downloadCount || 0 }));

  const barTopDownloadsConfig = {
    data: topDownloads.map(item => ({
      name: item.name,
      downloads: item.value,
    })),
    xField: 'name',
    yField: 'downloads',
    seriesField: 'name',
    legend: false,
    color: '#16AC66FF',
  };

  // Thống kê theo danh mục
  const categoryStats = categories.map((cat: any) => {
    const docsInCat = documents.filter((doc: any) => doc.categoryId === cat.categoryId && doc.isApproved === 'approved');
    return {
      categoryName: cat.categoryName,
      totalDocuments: docsInCat.length,
      totalDownloads: docsInCat.reduce((sum: number, doc: any) => sum + (doc.downloadCount || 0), 0),
    };
  });

  const categoryBarData = categoryStats.flatMap((item: any) => [
    { category: item.categoryName, type: 'Số tài liệu', value: item.totalDocuments },
    { category: item.categoryName, type: 'Lượt tải', value: item.totalDownloads || 0 },
  ]);

  const barCategoryGroupedConfig = {
    data: categoryBarData,
    isGroup: true,
    xField: 'category',
    yField: 'value',
    seriesField: 'type',
    color: (type: string) =>
      type === 'Số tài liệu' ? '#0482F0FF' : type === 'Lượt tải' ? '#FFF702FF' : '#04FF10FF',
    legend: { position: 'top-right' as const },
  };

  const exportCategoryStatsToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(categoryStats);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BaoCao');
    XLSX.writeFile(wb, 'BaoCaoHocLieu.xlsx');
  };

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Text strong>Tổng số tài liệu</Text>
            <Title level={2}>{totalDocuments}</Title>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Text strong>Trạng thái phê duyệt</Text>
            <Pie {...pieConfig} height={180} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Text strong>Top 5 lượt tải</Text>
            <Bar {...barTopDownloadsConfig} height={180} />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            title="Biểu đồ tổng quan theo danh mục"
            extra={
              <Button icon={<DownloadOutlined />} onClick={exportCategoryStatsToExcel}>
                Xuất báo cáo
              </Button>
            }
          >
            <Bar {...barCategoryGroupedConfig} height={300} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview;
