import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Typography, Statistic, List, Tag, Button, Space, Carousel, Divider } from 'antd';
import { UploadOutlined, BookOutlined, FileTextOutlined, DownloadOutlined, BellOutlined, FireOutlined, HomeOutlined, FileSearchOutlined, BarChartOutlined } from '@ant-design/icons';
import { Bar } from '@ant-design/charts';
import { getDocuments, getCategories } from '@/services/ThaoTacTaiLieu/index';
import type { Document, Category } from '@/services/ThaoTacTaiLieu/typings';
import styles from './index.less';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDocs: 0,
    totalCategories: 0,
    totalDownloads: 0,
    newDocsThisMonth: 0,
  });

  useEffect(() => {
    const docs: Document[] = getDocuments();
    const cats: Category[] = getCategories();
    // Recent documents: sort by uploadDate desc, lấy 5 tài liệu mới nhất
    const recent = [...docs]
      .sort((a, b) => {
        // uploadDate dạng DD/MM/YYYY
        const [da, ma, ya] = a.uploadDate.split('/').map(Number);
        const [db, mb, yb] = b.uploadDate.split('/').map(Number);
        return new Date(yb, mb - 1, db).getTime() - new Date(ya, ma - 1, da).getTime();
      })
      .slice(0, 5)
      .map(doc => ({
        id: doc.id,
        title: doc.title,
        category: cats.find(c => c.id === doc.category)?.name || doc.category,
        type: doc.fileType?.toUpperCase() || 'Khác',
        date: doc.uploadDate,
        downloads: doc.downloadCount,
      }));
    setRecentDocuments(recent);

    // Thống kê danh mục: lấy top 5 danh mục có nhiều tài liệu nhất
    const catMap: Record<string, number> = {};
    docs.forEach(doc => {
      const catName = cats.find(c => c.id === doc.category)?.name || doc.category;
      catMap[catName] = (catMap[catName] || 0) + 1;
    });
    const catData = Object.entries(catMap)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    setCategoryData(catData);

    // Thông báo: lấy 5 tài liệu mới nhất làm thông báo mẫu
    setNotifications(recent.map(doc => ({
      id: doc.id,
      content: `Tài liệu mới: ${doc.title}`,
      date: doc.date,
    })));

    // Thống kê tổng
    const totalDocs = docs.length;
    const totalCategories = cats.length;
    const totalDownloads = docs.reduce((sum, d) => sum + d.downloadCount, 0);
    // Tài liệu mới trong tháng hiện tại
    const now = new Date();
    const newDocsThisMonth = docs.filter(doc => {
      const [d, m, y] = doc.uploadDate.split('/').map(Number);
      return m === now.getMonth() + 1 && y === now.getFullYear();
    }).length;
    setStats({ totalDocs, totalCategories, totalDownloads, newDocsThisMonth });
  }, []);

  // Header navigation menu
  const menu = (
    <div className={styles.headerMenu}>
      <Button type="link" icon={<HomeOutlined />} href="/user/Home" style={{ color: '#1890ff', fontWeight: 600 }}>Trang chủ</Button>
      <Button type="link" icon={<FileSearchOutlined />} href="/user/TaiLieu" style={{ fontWeight: 600 }}>Tài liệu</Button>
      <Button type="link" icon={<BarChartOutlined />} href="/user/ThongKe" style={{ fontWeight: 600 }}>Thống kê</Button>
	  <Button type="link" icon={<UploadOutlined />} href="/user/ThaoTacTaiLieu" style={{ fontWeight: 600 }}>Thao tác tài liệu</Button>
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
				  <Button type="primary" size="large" icon={<BookOutlined />} onClick={() => window.location.href = '/user/TaiLieu'}>Khám phá tài liệu</Button>
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
				  <Title level={2}>Tài liệu học tập của bạn</Title>
				  <Paragraph>Xem các tài liệu mà bạn đăng tải.</Paragraph>
				  <Button type="primary" size="large" icon={<BookOutlined />} onClick={() => window.location.href = '/user/ThaoTacTaiLieu'}>Xem tài liệu của bạn</Button>
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
					  <Button
						type="link"
						icon={<DownloadOutlined />}
						onClick={() => {
						  // Tìm tài liệu thực tế từ localStorage
						  const docs = getDocuments();
						  const doc = docs.find(d => d.id === item.id);
						  if (doc && doc.fileUrl) {
							// Tăng lượt tải
							doc.downloadCount = (doc.downloadCount || 0) + 1;
							// Lưu lại vào localStorage
							const newDocs = docs.map(d => d.id === doc.id ? doc : d);
							localStorage.setItem('documents', JSON.stringify(newDocs));
							// Tải file
							const link = document.createElement('a');
							link.href = doc.fileUrl;
							link.download = doc.title + (doc.fileType ? '.' + doc.fileType : '');
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
						  }
						}}
					  >
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
				<Card title="Top tài liệu được tải về nhiều nhất" bordered={false}>
				<Bar
					data={getDocuments()
					.slice()
					.sort((a, b) => b.downloadCount - a.downloadCount)
					.slice(0, 5)
					.map(doc => ({
						title: doc.title,
						downloads: doc.downloadCount,
					}))}
					xField="title"
					yField="downloads"
					seriesField="title"
					color={(item: any) => {
					const colors = ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262fd'];
					return colors[getDocuments().findIndex(d => d.title === item.title) % colors.length];
					}}
					columnStyle={{ radius: [4, 4, 0, 0] }}
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
					data={categoryData}
					xField="category"
					yField="value"
					seriesField="category"
					color={(item: any) => {
					const colors = ['#5AD8A6', '#5B8FF9', '#F6BD16', '#E8684A', '#6DC8EC'];
					return colors[categoryData.findIndex(d => d.category === item.category) % colors.length];
					}}
					columnStyle={{ radius: [4, 4, 0, 0] }}
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