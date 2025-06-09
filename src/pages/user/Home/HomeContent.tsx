import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Statistic, Button, Carousel } from 'antd';
import { BookOutlined, FileTextOutlined, DownloadOutlined } from '@ant-design/icons';
import { Bar, Column } from '@ant-design/charts';
import axios from 'axios';
import styles from './index.less';
import FormThongTinNguoiDung from '@/components/FormThongtinnguoidung';

const { Title, Paragraph } = Typography;

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  uploadedBy: string;
  uploadDate: string;
  fileUrl: string;
  downloads?: number;
  downloadCount?: number;
  status?: string;
  [key: string]: any;
}

interface HomeContentProps {
  menu: React.ReactNode;
  notificationContent?: React.ReactNode;
  showNotifications: boolean;
  setShowNotifications: (open: boolean) => void;
  handleAvatarClick: () => void;
  stats: any;
  recentDocuments: any[];
  categoryData: any[];
  documents?: Document[];
}

const HomeContent: React.FC<HomeContentProps> = ({
  menu,
  notificationContent,
  showNotifications,
  setShowNotifications,
  handleAvatarClick,
  stats,
  recentDocuments,
  categoryData,
  documents = [],
}) => {
  const [topDownloadedDocs, setTopDownloadedDocs] = useState<Document[]>([]);
  const [totalDocCount, setTotalDocCount] = useState<number>(0);
  const [totalDownloadCount, setTotalDownloadCount] = useState<number>(0);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [topDocsRes, totalDocsRes, totalDownloadsRes] = await Promise.all([
        axios.get('http://localhost:3000/api/statistics/top-documents', { params: { limit: 6 } }),
        axios.get('http://localhost:3000/api/statistics/total-documents'),
        axios.get('http://localhost:3000/api/statistics/total-downloads'),
      ]);

      const topDocs = Array.isArray(topDocsRes.data) ? topDocsRes.data : [];
      const totalDocs = totalDocsRes.data?.total ?? 0;
      const totalDownloads = totalDownloadsRes.data?.total ?? 0;

      setTopDownloadedDocs(topDocs);
      setTotalDocCount(totalDocs);
      setTotalDownloadCount(totalDownloads);
    } catch (error) {
      console.error('Lỗi khi fetch dữ liệu thống kê:', error);
      setTopDownloadedDocs([]);
      setTotalDocCount(0);
      setTotalDownloadCount(0);
    }
  };

  fetchData();
}, []);
  const documentstotal = React.useMemo(() => {
      try {
        return JSON.parse(localStorage.getItem('data') || '[]');
      } catch {
        return [];
      }
    }, []);
  const totalDocuments = documentstotal.filter((doc: any) => doc.isApproved === 'approved').length;
  const topCategoryDownloaded = Array.isArray(categoryData)
    ? [...categoryData].sort((a, b) => (b.value || 0) - (a.value || 0)).slice(0, 5)
    : [];

  const [totalApprovedDocs, setTotalApprovedDocs] = useState<number>(0);
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/statistics/total-documents'); // ⚠️ Sửa lại URL theo API thực tế của bạn
        const allDocs = res.data || [];
        const approvedDocs = allDocs.filter((doc: any) => doc.isApproved === 'approved');
        setTotalApprovedDocs(approvedDocs.length);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <>
      <div className={styles.stickyHeader}>
        {menu}
        <div className={styles.headerRight}>
          {notificationContent}
          <FormThongTinNguoiDung totalDownloads={totalDownloadCount} totalUploads={totalDocCount} />
        </div>
      </div>

      <div className={styles.homeContainer}>
        {/* Banner Section */}
        <Card bordered={false} className={styles.banner}>
          <Carousel autoplay className={styles.carousel}>
            <div>
              <Row align="middle" className={styles.carouselItem}>
                <Col span={12}>
                  <Title level={2}>Chào mừng đến với hệ thống quản lý tài liệu nội bộ</Title>
                  <Paragraph>
                    Truy cập, tìm kiếm và tải xuống các tài liệu học tập, giáo trình và bài giảng một cách nhanh chóng.
                  </Paragraph>
                  <Button
                    type="primary"
                    size="large"
                    icon={<BookOutlined />}
                    onClick={() => window.location.href = '/user/TaiLieu'}
                  >
                    Khám phá tài liệu
                  </Button>
                </Col>
              </Row>
            </div>
            <div>
              <Row align="middle" className={styles.carouselItem2}>
                <Col span={12}>
                  <Title level={2}>Tài liệu học tập của bạn</Title>
                  <Paragraph>Xem các tài liệu mà bạn đăng tải.</Paragraph>
                  <Button
                    type="primary"
                    size="large"
                    icon={<BookOutlined />}
                    onClick={() => window.location.href = '/user/ThaoTacTaiLieu'}
                  >
                    Xem tài liệu của bạn
                  </Button>
                </Col>
              </Row>
            </div>
          </Carousel>
        </Card>

        {/* Thống kê */}
        <div style={{ marginLeft: 150 }}>
          <Row gutter={16} className={styles.statsRow}>
            <Col span={6}>
              <Card bordered={false}>
                <Statistic title="Tổng số tài liệu" value={totalApprovedDocs} prefix={<FileTextOutlined />} />
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false}>
                <Statistic title="Tổng Số Danh mục" value={stats.totalCategories} prefix={<BookOutlined />} />
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false}>
                <Statistic title="Lượt tải xuống" value={totalDownloadCount} prefix={<DownloadOutlined />} />
              </Card>
            </Col>
          </Row>

        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Card title="Top 3 tài liệu được tải về nhiều nhất" bordered={false}>
              <Bar
                data={topDownloadedDocs}
                xField="downloadCount"
                yField="title"
                barStyle={{ radius: [4, 4, 4, 4] }}
                label={{
                  position: 'right',
                  style: {
                    fill: '#63DAAB',
                    fontWeight: 500,
                  },
                }}
                meta={{
                  title: { alias: 'Tài liệu' },
                  downloadCount: { alias: 'Lượt tải' },
                }}
                xAxis={{ title: { text: 'Lượt tải', style: { fontWeight: 600 } } }}
                yAxis={{ title: { text: 'Tài liệu', style: { fontWeight: 600 } } }}
                color={(_item: any, _defaultColor?: string) => {
                  const colors = ['#61DDAA', '#5B8FF9', '#F6BD16'];
                  const idx = topDownloadedDocs.findIndex(doc => doc.id === _item.id);
                  return colors[idx] || '#63DAAB';
                }}
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Top danh mục có nhiều tài liệu nhất" bordered={false}>
              <div style={{ width: '100%', height: 400 }}>
                <Column
                  data={topCategoryDownloaded}
                  xField="category"
                  yField="value"
                  seriesField="category"
                  columnWidthRatio={0.5}
                  label={{
                    position: 'top',
                    style: {
                      fill: '#595959',
                      fontWeight: 500,
                    },
                  }}
                  meta={{
                    category: { alias: 'Danh mục' },
                    value: { alias: 'Số tài liệu' },
                  }}
                  xAxis={{ title: { text: 'Danh mục', style: { fontWeight: 600 } } }}
                  yAxis={{ title: { text: 'Số tài liệu', style: { fontWeight: 600 } } }}
                />
              </div>
            </Card>
          </Col>
        </Row>

        <Card title="Danh mục phổ biến" bordered={false} className={styles.categoriesSection}>
          <Row gutter={[16, 16]} justify="center">
            {categoryData.slice(0, 5).map((category) => (
              <Col span={4} key={category.category} style={{ minWidth: 180 }}>
                <Card hoverable className={styles.categoryCard}>
                  <div className={styles.categoryContent}>
                    <BookOutlined className={styles.categoryIcon} />
                    <Title level={4}>{category.category}</Title>
                    <Paragraph>{category.value} tài liệu</Paragraph>
                    <Button
                      type="primary"
                      onClick={() =>
                        window.location.href = `/user/TaiLieu?category=${encodeURIComponent(category.category)}`
                      }
                    >
                      Xem danh mục
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    </>
  );
};

export default HomeContent;
