import React from 'react';
import { Card, Row, Col, Typography, Statistic, Tag, Button, Carousel, Divider } from 'antd';
import { BookOutlined, FileTextOutlined, DownloadOutlined, FireOutlined } from '@ant-design/icons';
import { Bar } from '@ant-design/charts';
import styles from './index.less';

const { Title, Paragraph } = Typography;

interface HomeContentProps {
  menu: React.ReactNode;
  notificationContent: React.ReactNode;
  showNotifications: boolean;
  setShowNotifications: (open: boolean) => void;
  handleAvatarClick: () => void;
  stats: any;
  recentDocuments: any[];
  categoryData: any[];
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
}) => (
  <>
    <div className={styles.stickyHeader}>
      {menu}
      <div className={styles.headerRight}>
        {notificationContent}
        <div className={styles.avatar} onClick={handleAvatarClick} title="Đăng nhập">
          <img src={require('@/assets/admin.png')} alt="avatar" />
        </div>
      </div>
    </div>
    <div className={styles.homeContainer}>
      {/* Banner section */}
      <Card bordered={false} className={styles.banner}>
        <Carousel autoplay className={styles.carousel}>
          <div>
            <Row align="middle" justify="center" className={styles.carouselItem}>
              <Col span={12}>
                <Title level={2}>Chào mừng đến với hệ thống quản lý tài liệu nội bộ</Title>
                <Paragraph>Truy cập, tìm kiếm và tải xuống các tài liệu học tập, giáo trình và bài giảng một cách nhanh chóng.</Paragraph>
                <Button type="primary" size="large" icon={<BookOutlined />} onClick={() => window.location.href = '/user/TaiLieu'}>Khám phá tài liệu</Button>
              </Col>
              <Col span={12} className={styles.carouselImage}>
                <div className={styles.imagePlaceholder}>
                  <FileTextOutlined style={{ fontSize: 100 }} />
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Row align="middle" justify="center" className={styles.carouselItem}>
              <Col span={12}>
                <Title level={2}>Tài liệu học tập của bạn</Title>
                <Paragraph>Xem các tài liệu mà bạn đăng tải.</Paragraph>
                <Button type="primary" size="large" icon={<BookOutlined />} onClick={() => window.location.href = '/user/ThaoTacTaiLieu'}>Xem tài liệu của bạn</Button>
              </Col>
              <Col span={12} className={styles.carouselImage}>
                <div className={styles.imagePlaceholder}>
                  <BookOutlined style={{ fontSize: 100 }} />
                </div>
              </Col>
            </Row>
          </div>
        </Carousel>
      </Card>
      {/* Statistics section */}
      <Row gutter={16} className={styles.statsRow}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Tổng số tài liệu" value={stats.totalDocs} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Danh mục" value={stats.totalCategories} prefix={<BookOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Lượt tải xuống" value={stats.totalDownloads} prefix={<DownloadOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Tài liệu mới trong tháng" value={stats.newDocsThisMonth} prefix={<FireOutlined />} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        {/* Charts section */}
        <Col span={12}>
          <Card title="Top tài liệu được tải về nhiều nhất" bordered={false}>
            <Bar
              data={Array.isArray(recentDocuments) && recentDocuments.length > 0 ? recentDocuments
                .slice()
                .sort((a, b) => b.downloads - a.downloads)
                .slice(0, 5)
                .map(doc => ({
                  title: doc.title,
                  downloads: doc.downloads,
                })) : []}
              xField="title"
              yField="downloads"
              seriesField="title"
              color={(item: any) => {
                const colors = ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262fd'];
                const idx = recentDocuments.findIndex(d => d.title === item.title);
                return colors[idx >= 0 ? idx % colors.length : 0];
              }}
              barStyle={{ radius: [4, 4, 0, 0] }}
              label={{
                position: 'top',
                style: {
                  fill: '#595959',
                  fontWeight: 500,
                },
              }}
              meta={{
                title: { alias: 'Tài liệu' },
                downloads: { alias: 'Lượt tải' },
              }}
              xAxis={{
                title: { text: 'Tài liệu', style: { fontWeight: 600 } },
                label: { rotate: -30, style: { fontSize: 12, fontWeight: 500 } },
              }}
              yAxis={{
                title: { text: 'Lượt tải', style: { fontWeight: 600 } },
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top danh mục phổ biến được tải về" bordered={false}>
            <Bar
              data={Array.isArray(categoryData) && categoryData.length > 0 ? categoryData : []}
              xField="category"
              yField="value"
              seriesField="category"
              color={(item: any) => {
                const colors = ['#5AD8A6', '#5B8FF9', '#F6BD16', '#E8684A', '#6DC8EC'];
                const idx = categoryData.findIndex(d => d.category === item.category);
                return colors[idx >= 0 ? idx % colors.length : 0];
              }}
              barStyle={{ radius: [4, 4, 0, 0] }}
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
              xAxis={{
                title: { text: 'Danh mục', style: { fontWeight: 600 } },
                label: { rotate: -30, style: { fontSize: 12, fontWeight: 500 } },
              }}
              yAxis={{
                title: { text: 'Số tài liệu', style: { fontWeight: 600 } },
              }}
            />
          </Card>
        </Col>
      </Row>
      {/* Popular categories section */}
      <Card
        title="Danh mục phổ biến"
        bordered={false}
        className={styles.categoriesSection}
      >
        <Row gutter={[16, 16]}>
          {categoryData.slice(0, 5).map((category) => (
            <Col span={8} key={category.category}>
              <Card
                hoverable
                className={styles.categoryCard}
              >
                <div className={styles.categoryContent}>
                  <BookOutlined className={styles.categoryIcon} />
                  <Title level={4}>{category.category}</Title>
                  <Paragraph>{category.value} tài liệu</Paragraph>
                  <Button type="primary" onClick={() => window.location.href = `/user/TaiLieu?category=${encodeURIComponent(category.category)}`}>Xem danh mục</Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  </>
);

export default HomeContent;
