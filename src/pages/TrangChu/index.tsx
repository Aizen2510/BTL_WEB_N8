import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Col, Row, Typography, Button, Table, Divider, message } from 'antd';
import { FileTextOutlined, BarChartOutlined } from '@ant-design/icons';
import { Bar } from '@ant-design/plots';
import axios from 'axios';

const { Title, Text } = Typography;

const DocumentDashboard: React.FC = () => {
  const history = useHistory();

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
          'Content-Type': 'application/json'
        };

        // Gọi từng API riêng biệt để dễ debug
        try {
          const totalDocumentsRes = await axios.get(
            'http://localhost:3000/api/statistics/total-documents', 
            { headers }
          );
          setTotalDocuments(totalDocumentsRes.data.totalDocuments || 0);
        } catch (error) {
          console.error('Lỗi khi lấy tổng số tài liệu:', error);
          message.warning('Không thể tải tổng số tài liệu');
        }

        try {
          const approvalStatsRes = await axios.get(
            'http://localhost:3000/api/statistics/document-approval-stats', 
            { headers }
          );
          
          const formattedApprovalStats = approvalStatsRes.data.map((item: any, index: number) => ({
            key: index,
            type: item.status || item.type || 'Không xác định',
            value: item.count || item.value || 0,
          }));
          setApprovalStats(formattedApprovalStats);
        } catch (error) {
          console.error('Lỗi khi lấy thống kê duyệt:', error);
          message.warning('Không thể tải thống kê trạng thái duyệt');
        }

        try {
          const topDownloadsRes = await axios.get(
            'http://localhost:3000/api/statistics/top-documents-with-status', 
            { headers }
          );
          
          const topDocs = topDownloadsRes.data.map((doc: any, index: number) => ({
            key: index,
            name: doc.title || doc.name || 'Không có tên',
            value: doc.downloadCount || doc.downloads || 0,
          }));
          setTopDownloads(topDocs.slice(0, 5)); // Chỉ lấy top 5
        } catch (error) {
          console.error('Lỗi khi lấy top downloads:', error);
          message.warning('Không thể tải danh sách tài liệu được tải nhiều nhất');
        }

        try {
          const categoryOverviewRes = await axios.get(
            'http://localhost:3000/api/statistics/category', 
            { headers }
          );
          
          const formattedCategoryStats = categoryOverviewRes.data.map((item: any) => ({
            category: item.category || item.categoryName || 'Khác',
            value: item.count || item.value || 0,
            type: item.type || 'Tài liệu',
          }));
          setCategoryStats(formattedCategoryStats);
        } catch (error) {
          console.error('Lỗi khi lấy thống kê danh mục:', error);
          message.warning('Không thể tải thống kê theo danh mục');
        }

      } catch (error) {
        console.error('Lỗi chung khi tải dữ liệu:', error);
        message.error('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statusColumns = [
    { 
      title: 'Trạng thái', 
      dataIndex: 'type', 
      key: 'type',
      render: (text: string) => text || 'N/A'
    },
    { 
      title: 'Số lượng', 
      dataIndex: 'value', 
      key: 'value',
      render: (value: number) => value || 0
    },
  ];

  const topDownloadColumns = [
    { 
      title: 'Tên tài liệu', 
      dataIndex: 'name', 
      key: 'name',
      render: (text: string) => text || 'Không có tên',
      ellipsis: true
    },
    { 
      title: 'Lượt tải', 
      dataIndex: 'value', 
      key: 'value',
      render: (value: number) => value || 0
    },
  ];

  const barCategoryGroupedConfig = {
    data: categoryStats,
    isGroup: true,
    xField: 'category',
    yField: 'value',
    seriesField: 'type',
    legend: { position: 'top-right' as const },
    height: 300,
  };

  return (
    <div className="p-4">
      <Title level={3}>TỔNG QUAN TÀI LIỆU</Title>

      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Card title="Tổng số tài liệu" bordered loading={loading}>
            <Text strong style={{ fontSize: 28, color: '#1890ff' }}>
              {totalDocuments.toLocaleString()}
            </Text>
            <Divider />
            <Text type="secondary">Tổng hợp toàn bộ tài liệu đã duyệt</Text>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Trạng thái duyệt tài liệu" bordered loading={loading}>
            <Table
              dataSource={approvalStats}
              columns={statusColumns}
              pagination={false}
              size="small"
              rowKey="key"
              locale={{ emptyText: 'Không có dữ liệu' }}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Top 5 lượt tải" loading={loading}>
            <Table
              dataSource={topDownloads}
              columns={topDownloadColumns}
              pagination={false}
              size="small"
              rowKey="key"
              locale={{ emptyText: 'Không có dữ liệu' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Card title="Biểu đồ tổng quan theo danh mục" loading={loading}>
            {categoryStats.length > 0 ? (
              <Bar {...barCategoryGroupedConfig} />
            ) : (
              <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>
                Không có dữ liệu để hiển thị biểu đồ
              </div>
            )}
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