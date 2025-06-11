import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Button, message } from 'antd';
import { Pie, Bar } from '@ant-design/plots';
import { DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;

const DashboardOverview: React.FC = () => {
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [approvalStats, setApprovalStats] = useState<any[]>([]);
  const [topDownloads, setTopDownloads] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('Không tìm thấy token xác thực');
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const [
          totalRes,
          approvalRes,
          topDownloadsRes,
          categoryRes,
        ] = await Promise.all([
          axios.get('http://localhost:3000/api/statistics/total-documents', { headers }),
          axios.get('http://localhost:3000/api/statistics/document-approval-stats', { headers }),
          axios.get('http://localhost:3000/api/statistics/top-documents-with-status', { headers }),
          axios.get('http://localhost:3000/api/statistics/category', { headers }),
        ]);

        setTotalDocuments(totalRes.data.totalDocuments || 0);

        const approvalData = approvalRes.data || [];
        const formattedApprovalStats = [
          { type: 'Đã duyệt', value: approvalData.find((i: any) => i.status === 'approved')?.count || 0 },
          { type: 'Chờ duyệt', value: approvalData.find((i: any) => i.status === 'pending')?.count || 0 },
          { type: 'Từ chối', value: approvalData.find((i: any) => i.status === 'rejected')?.count || 0 },
        ];
        setApprovalStats(formattedApprovalStats);

        const formattedTopDownloads = (topDownloadsRes.data || []).slice(0, 5).map((doc: any) => ({
          name: doc.title || 'Không tên',
          value: doc.downloadCount || 0,
        }));
        setTopDownloads(formattedTopDownloads);

        const formattedCategoryStats = (categoryRes.data || []).map((item: any) => ({
          category: item.category || item.categoryName || 'Không rõ',
          type: item.type || 'Tài liệu',
          value: item.count || item.value || 0,
        }));
        setCategoryStats(formattedCategoryStats);

      } catch (error) {
        console.error('Lỗi khi tải dữ liệu thống kê:', error);
        message.error('Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pieConfig = {
    data: approvalStats,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner' as const,
      offset: '-30%',
      content: '{value}',
      style: { fontSize: 14, textAlign: 'center' },
    },
    legend: true,
    color: ['#16AC66', '#F0C514', '#FF4D4F'],
  };

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

  const categoryStatMap: any = {};

  categoryStats.forEach(item => {
    const name = item.category;
    if (!categoryStatMap[name]) {
      categoryStatMap[name] = { totalDocuments: 0, totalDownloads: 0 };
    }

    if (item.type === 'Tài liệu') categoryStatMap[name].totalDocuments += item.value;
    if (item.type === 'Lượt tải') categoryStatMap[name].totalDownloads += item.value;
  });

  const categoryBarData = Object.entries(categoryStatMap).flatMap(([category, stats]: any) => [
    { category, type: 'Số tài liệu', value: stats.totalDocuments },
    { category, type: 'Lượt tải', value: stats.totalDownloads },
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
    const flatData = categoryBarData.reduce((acc: any[], item) => {
      const existing = acc.find(x => x.category === item.category);
      if (existing) {
        existing[item.type] = item.value;
      } else {
        acc.push({ category: item.category, [item.type]: item.value });
      }
      return acc;
    }, []);

    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BaoCao');
    XLSX.writeFile(wb, 'BaoCaoHocLieu.xlsx');
  };

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card loading={loading}>
            <Text strong>Tổng số tài liệu</Text>
            <Title level={2}>{totalDocuments}</Title>
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Text strong>Trạng thái phê duyệt</Text>
            <Pie {...pieConfig} height={180} />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
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
            loading={loading}
          >
            <Bar {...barCategoryGroupedConfig} height={300} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview;
