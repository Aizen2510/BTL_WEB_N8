import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Typography, Statistic, List, Tag, Button, Space, Carousel, Divider } from 'antd';
import { BookOutlined, FileTextOutlined, DownloadOutlined, BellOutlined, FireOutlined, HomeOutlined, FileSearchOutlined, BarChartOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import styles from './index.less';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  // Mock data for recent documents
  const [recentDocuments, setRecentDocuments] = useState([
	{ id: 1, title: 'Giáo trình Lập trình Web', category: 'Công nghệ thông tin', type: 'PDF', date: '2025-05-10', downloads: 156 },
	{ id: 2, title: 'Bài giảng Cơ sở dữ liệu', category: 'Công nghệ thông tin', type: 'PPTX', date: '2025-05-08', downloads: 89 },
	{ id: 3, title: 'Tài liệu Thiết kế UI/UX', category: 'Thiết kế', type: 'PDF', date: '2025-05-07', downloads: 204 },
	{ id: 4, title: 'Hướng dẫn đồ án tốt nghiệp', category: 'Khoa học máy tính', type: 'DOCX', date: '2025-05-05', downloads: 123 },
  ]);

  // Mock data for category statistics
  const categoryData = [
	{ category: 'Công nghệ thông tin', value: 245 },
	{ category: 'Khoa học máy tính', value: 187 },
	{ category: 'Thiết kế', value: 124 },
	{ category: 'Kinh tế', value: 98 },
	{ category: 'Ngoại ngữ', value: 65 },
  ];

  // Mock data for download trends
  const downloadTrends = [
	{ month: '01/2025', downloads: 1250 },
	{ month: '02/2025', downloads: 1380 },
	{ month: '03/2025', downloads: 1520 },
	{ month: '04/2025', downloads: 1680 },
	{ month: '05/2025', downloads: 1890 },
  ];

  // Mock data for notifications
  const [notifications, setNotifications] = useState([
	{ id: 1, content: 'Đã cập nhật bản mới của Giáo trình Lập trình Web', date: '2025-05-13' },
	{ id: 2, content: 'Tài liệu mới: Bài giảng Trí tuệ nhân tạo', date: '2025-05-12' },
	{ id: 3, content: 'Thông báo bảo trì hệ thống: 20/05/2025', date: '2025-05-11' },
  ]);

  // Header navigation menu
  const menu = (
    <div className={styles.headerMenu}>
      <Button type="link" icon={<HomeOutlined />} href="/TrangChu" style={{ color: '#1890ff', fontWeight: 600 }}>Trang chủ</Button>
      <Button type="link" icon={<FileSearchOutlined />} href="/TaiLieu" style={{ fontWeight: 600 }}>Tài liệu</Button>
      <Button type="link" icon={<BarChartOutlined />} href="/ThongKe" style={{ fontWeight: 600 }}>Thống kê</Button>
      <Button type="link" href="/ThemTaiLieu" style={{ fontWeight: 600 }}>Thêm tài liệu</Button>
      <Button type="link" href="/DuyetTaiLieu" style={{ fontWeight: 600 }}>Duyệt tài liệu</Button>
    </div>
  );

  // Avatar for user
  const handleAvatarClick = () => {
    window.location.href = '/user/login';
  };

  return (
	<PageContainer pageHeaderRender={false}>
	  <div className={styles.stickyHeader}>
		{menu}
		<div className={styles.headerRight}>
		  <div className={styles.avatar} onClick={handleAvatarClick} title="Đăng nhập">
			<img src={require('@/assets/admin.png')} alt="avatar" />
		  </div>
		</div>
	  </div>
	  <div className={styles.homeContainer}>
		{/* Quick search bar */}
		<Card bordered={false} className={styles.quickSearchCard}>
		  <input
			className={styles.quickSearchInput}
			placeholder="Tìm kiếm tài liệu nhanh..."
			style={{ maxWidth: 500, width: '100%', padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #d9d9d9' }}
		  />
		</Card>

		{/* Banner section */}
		<Card bordered={false} className={styles.banner}>
		  <Carousel autoplay className={styles.carousel}>
			<div>
			  <Row align="middle" justify="center" className={styles.carouselItem}>
				<Col span={12}>
				  <Title level={2}>Chào mừng đến với hệ thống quản lý tài liệu nội bộ</Title>
				  <Paragraph>Truy cập, tìm kiếm và tải xuống các tài liệu học tập, giáo trình và bài giảng một cách nhanh chóng.</Paragraph>
				  <Button type="primary" size="large" icon={<BookOutlined />}>Khám phá tài liệu</Button>
				</Col>
				<Col span={12} className={styles.carouselImage}>
				  {/* Placeholder for banner image */}
				  <div className={styles.imagePlaceholder}>
					<FileTextOutlined style={{ fontSize: 100 }} />
				  </div>
				</Col>
			  </Row>
			</div>
			<div>
			  <Row align="middle" justify="center" className={styles.carouselItem}>
				<Col span={12}>
				  <Title level={2}>Tài liệu học tập mới nhất</Title>
				  <Paragraph>Cập nhật liên tục các tài liệu học tập và giáo trình mới nhất từ các khoa.</Paragraph>
				  <Button type="primary" size="large" icon={<BookOutlined />}>Xem tài liệu mới</Button>
				</Col>
				<Col span={12} className={styles.carouselImage}>
				  {/* Placeholder for banner image */}
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
			  <Statistic title="Tổng số tài liệu" value={719} prefix={<FileTextOutlined />} />
			</Card>
		  </Col>
		  <Col span={6}>
			<Card bordered={false}>
			  <Statistic title="Danh mục" value={18} prefix={<BookOutlined />} />
			</Card>
		  </Col>
		  <Col span={6}>
			<Card bordered={false}>
			  <Statistic title="Lượt tải xuống" value={8502} prefix={<DownloadOutlined />} />
			</Card>
		  </Col>
		  <Col span={6}>
			<Card bordered={false}>
			  <Statistic title="Tài liệu mới trong tháng" value={42} prefix={<FireOutlined />} />
			</Card>
		  </Col>
		</Row>

		<Row gutter={16}>
		  {/* Recent documents section */}
		  <Col span={16}>
			<Card
			  title="Tài liệu mới nhất"
			  bordered={false}
			  className={styles.recentDocsCard}
			  extra={<Button type="link">Xem tất cả</Button>}
			>
			  <List
				itemLayout="horizontal"
				dataSource={recentDocuments}
				renderItem={(item) => (
				  <List.Item
					actions={[
					  <Button type="link" icon={<DownloadOutlined />}>
						Tải xuống ({item.downloads})
					  </Button>,
					]}
				  >
					<List.Item.Meta
					  title={<a href={`/documents/${item.id}`}>{item.title}</a>}
					  description={
						<Space>
						  <Tag color="blue">{item.category}</Tag>
						  <Tag color="green">{item.type}</Tag>
						  <span>Ngày đăng: {item.date}</span>
						</Space>
					  }
					/>
				  </List.Item>
				)}
			  />
			</Card>
		  </Col>

		  {/* Notifications section */}
		  <Col span={8}>
			<Card
			  title="Thông báo"
			  bordered={false}
			  className={styles.notificationsCard}
			  extra={<BellOutlined />}
			>
			  <List
				itemLayout="horizontal"
				dataSource={notifications}
				renderItem={(item) => (
				  <List.Item>
					<List.Item.Meta
					  title={item.content}
					  description={`Ngày: ${item.date}`}
					/>
				  </List.Item>
				)}
			  />
			</Card>
		  </Col>
		</Row>

		<Divider />

		{/* Charts section */}
		<Row gutter={16}>
		  <Col span={12}>
			<Card title="Phân bố tài liệu theo danh mục" bordered={false}>
			  <Pie
				data={categoryData}
				angleField="value"
				colorField="category"
				radius={0.8}
				label={{
				  type: 'outer',
				  content: '{name}: {percentage}',
				}}
				interactions={[{ type: 'pie-legend-active' }, { type: 'element-active' }]}
			  />
			</Card>
		  </Col>
		  <Col span={12}>
			<Card title="Xu hướng lượt tải xuống" bordered={false}>
			  <Line
				data={downloadTrends}
				xField="month"
				yField="downloads"
				point={{
				  size: 5,
				  shape: 'diamond',
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
			{categoryData.map((category) => (
			  <Col span={8} key={category.category}>
				<Card hoverable className={styles.categoryCard}>
				  <div className={styles.categoryContent}>
					<BookOutlined className={styles.categoryIcon} />
					<Title level={4}>{category.category}</Title>
					<Paragraph>{category.value} tài liệu</Paragraph>
					<Button type="primary">Xem danh mục</Button>
				  </div>
				</Card>
			  </Col>
			))}
		  </Row>
		</Card>
	  </div>
	</PageContainer>
  );
};

export default HomePage;