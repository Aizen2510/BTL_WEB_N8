import React from 'react';
import { Row, Col, Card, Typography, Button } from 'antd';
import { Pie, Bar } from '@ant-design/plots';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useModel } from 'umi';

const { Title, Text } = Typography;

type CategoryStatistic = {
  categoryName: string;
  totalDocuments: number;
  totalDownloads: number;
};

const DashboardOverview: React.FC = () => {
  const {
    categoryStats = [],
    fileTypeStats = [],
    chartTopDownload = [],
    excelExportRows = [],
  } = useModel('documentReportState');

  // ✅ Dữ liệu mẫu khi rỗng
  const mockCategoryStats = [
    { categoryName: 'Giáo trình', totalDocuments: 12, totalDownloads: 45 },
    { categoryName: 'Bài giảng', totalDocuments: 8, totalDownloads: 27 },
    { categoryName: 'Đề thi', totalDocuments: 5, totalDownloads: 19 },
  ];

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

  // 👇 Ưu tiên dữ liệu thật, nếu rỗng thì dùng mock
  const usedCategoryStats = categoryStats.length ? categoryStats : mockCategoryStats;
  const usedFileTypeStats = fileTypeStats.length ? fileTypeStats : mockFileTypeStats;
  const usedTopDownloads = chartTopDownload.length ? chartTopDownload : mockTopDownloads;

  // Pie chart - Số lượng theo định dạng
  const pieConfig = {
    data: usedFileTypeStats.map(item => ({ type: item.fileType, value: item.totalDocuments })),
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner' as const,
      offset: '-30%',
      content: '{value}',
      style: { fontSize: 14, textAlign: 'center' },
    },
    legend: false,
  };

  // Bar chart - Top download
  const barTopDownloadsConfig = {
    data: usedTopDownloads.map(item => ({
      name: item.name,
      downloads: item.value,
    })),
    xField: 'name',
    yField: 'downloads',
    seriesField: 'name',
    legend: false,
    color: '#16AC66FF',
  };

  // Grouped bar - Tài liệu & lượt tải theo danh mục
  const categoryBarData = usedCategoryStats.flatMap(item => [
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
    const ws = XLSX.utils.json_to_sheet(excelExportRows.length ? excelExportRows : usedCategoryStats);
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
            <Title level={2}>{usedCategoryStats.reduce((sum, c) => sum + c.totalDocuments, 0)}</Title>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Text strong>Số lượng theo định dạng</Text>
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
