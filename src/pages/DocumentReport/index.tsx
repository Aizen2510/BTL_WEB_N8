import React from 'react';
import { Button, Card, Col, Row, Typography } from 'antd';
import { Bar, Pie } from '@ant-design/charts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Title } = Typography;

const DocumentReportPage: React.FC = () => {
  // Dữ liệu cứng mẫu
  const categoryStats = [
    { categoryName: 'Toán học', documentCount: 120 },
    { categoryName: 'Văn học', documentCount: 95 },
    { categoryName: 'Lịch sử', documentCount: 80 },
    { categoryName: 'Khoa học', documentCount: 150 },
    { categoryName: 'Ngoại ngữ', documentCount: 60 },
  ];

  // Người đăng tải đã bị xóa khỏi đây
  // const uploaderStats = [...];

  const fileTypeStats = [
    { fileType: 'PDF', count: 250 },
    { fileType: 'DOCX', count: 120 },
    { fileType: 'PPTX', count: 90 },
    { fileType: 'XLSX', count: 40 },
  ];

  const downloadStats = {
    byCategory: [
      { categoryName: 'Toán học', count: 400 },
      { categoryName: 'Văn học', count: 300 },
      { categoryName: 'Lịch sử', count: 250 },
      { categoryName: 'Khoa học', count: 450 },
      { categoryName: 'Ngoại ngữ', count: 150 },
    ],
    byDocument: [
      { title: 'Giải tích 1', count: 120 },
      { title: 'Văn mẫu lớp 12', count: 110 },
      { title: 'Lịch sử thế giới', count: 90 },
      { title: 'Hóa học đại cương', count: 100 },
      { title: 'Tiếng Anh cơ bản', count: 80 },
    ],
  };

  // --- Chuyển dữ liệu thành dạng dài cho biểu đồ cột nhóm ---
  const groupedBarData = [
    // Số tài liệu theo danh mục
    ...categoryStats.map((item) => ({
      group: item.categoryName,
      type: 'Số tài liệu (Danh mục)',
      value: item.documentCount,
    })),
    // Lượt tải theo danh mục
    ...downloadStats.byCategory.map((item) => ({
      group: item.categoryName,
      type: 'Lượt tải (Danh mục)',
      value: item.count,
    })),
    // Bỏ phần số tài liệu theo người đăng tải
  ];

  // Dữ liệu để xuất Excel, bỏ phần người đăng tải
  const excelExportRows = [
    ...categoryStats.map((item) => ({
      Loại: 'Danh mục tài liệu',
      Tên: item.categoryName,
      Số_lượng: item.documentCount,
    })),
    // ...uploaderStats.map(...) bị xóa
    ...fileTypeStats.map((item) => ({
      Loại: 'Định dạng file',
      Tên: item.fileType,
      Số_lượng: item.count,
    })),
    ...downloadStats.byCategory.map((item) => ({
      Loại: 'Lượt tải theo danh mục',
      Tên: item.categoryName,
      Số_lượng: item.count,
    })),
  ];

  // Hàm xuất Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(excelExportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo cáo tài liệu');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'bao_cao_tai_lieu.xlsx');
  };

  // Cấu hình biểu đồ cột nhóm
  const groupedBarConfig = {
    data: groupedBarData,
    isGroup: true,
    xField: 'value',
    yField: 'group',
    seriesField: 'type',
    maxBarWidth: 24,
    legend: {
      position: 'right-top',
      layout: 'vertical',
    },
    label: {
      position: 'middle',
      style: {
        fill: '#67B7F0BE',
        opacity: 0.6,
      },
    },
    barStyle: {
      radius: [4, 4, 0, 0],
    },
    // them mau 
    color: ({ type }: { type: string }) => {
    if (type === 'Số tài liệu (Danh mục)') {
      return '#33FF00FF'; // màu vàng (Ant Design yellow-4)
    }
    if (type === 'Lượt tải (Danh mục)') {
      return '#0687FFFF'; // màu xanh lá (Ant Design green-6)
    }
    return '#0687FFFF'; // màu mặc định (xanh dương)
  },
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>5. Báo cáo và Thống kê</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Biểu đồ cột nhóm: Số tài liệu và lượt tải theo danh mục">
            <Bar {...groupedBarConfig} />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Số lượng tài liệu theo định dạng">
            <Pie
              data={fileTypeStats}
              angleField="count"
              colorField="fileType"
              radius={0.9}
              label={{
                type: 'outer',
                content: '{name} ({percentage})',
              }}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Top 5 tài liệu được tải nhiều nhất">
            <Bar
              data={downloadStats.byDocument}
              xField="count"
              yField="title"
              seriesField="title"
              legend={false}
              maxBarWidth={30}
              color="#eb2f96"
            />
          </Card>
        </Col>

        <Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleExportExcel}>
            Xuất file Excel
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default DocumentReportPage;
