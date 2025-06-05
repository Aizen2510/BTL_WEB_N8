// import React from 'react';
// import { Card, Row, Col, Typography, Statistic, Tag, Button, Carousel, Divider } from 'antd';
// import { BookOutlined, FileTextOutlined, DownloadOutlined, FireOutlined } from '@ant-design/icons';
// import { Bar, Column } from '@ant-design/charts';
// import styles from './index.less';
// import FormThongTinNguoiDung from '@/components/FormThongtinnguoidung';

// const { Title, Paragraph } = Typography;

// interface HomeContentProps {
//   menu: React.ReactNode;
//   notificationContent: React.ReactNode;
//   showNotifications: boolean;
//   setShowNotifications: (open: boolean) => void;
//   handleAvatarClick: () => void;
//   stats: any;
//   recentDocuments: any[];
//   categoryData: any[];
//   documents?: any[]; // nhận documents từ cha
// }

// const HomeContent: React.FC<HomeContentProps> = ({
//   menu,
//   notificationContent,
//   showNotifications,
//   setShowNotifications,
//   handleAvatarClick,
//   stats,
//   recentDocuments,
//   categoryData,
//   documents = [],
// }) => {
//   // Tính tổng số lượt tải xuống từ documents (ưu tiên downloads, fallback downloadCount)
//   const totalDownloads = React.useMemo(
//     () => documents.reduce((sum, doc) => sum + (doc.downloads ?? doc.downloadCount ?? 0), 0),
//     [documents]
//   );

//   // Lấy top 5 tài liệu được tải về nhiều nhất từ toàn bộ documents
//   const topDownloadedDocs = Array.isArray(documents)
//     ? [...documents]
//         .filter(doc => doc && typeof (doc.downloads ?? doc.downloadCount) === 'number')
//         .sort((a, b) => ((b.downloads ?? b.downloadCount ?? 0) - (a.downloads ?? a.downloadCount ?? 0)))
//         .slice(0, 5)
//     : [];

//   // Lấy top 5 danh mục phổ biến được tải về nhiều nhất
//   const topCategoryDownloaded = Array.isArray(categoryData)
//     ? [...categoryData]
//         .sort((a, b) => (b.value || 0) - (a.value || 0))
//         .slice(0, 5)
//     : [];

//   return (
//     <>
//       <div className={styles.stickyHeader}>
//         {menu}
//         <div className={styles.headerRight}>
//           {notificationContent}
//           {/* Truyền đúng prop totalDownloads */}
//           <FormThongTinNguoiDung totalDownloads={totalDownloads} />
//         </div>
//       </div>
//       <div className={styles.homeContainer}>
//         {/* Banner section */}
//         <Card bordered={false} className={styles.banner}>
//           <Carousel autoplay className={styles.carousel}>
//             <div>
//               <Row align="middle" justify="center" className={styles.carouselItem}>
//                 <Col span={12}>
//                   <Title level={2}>Chào mừng đến với hệ thống quản lý tài liệu nội bộ</Title>
//                   <Paragraph>Truy cập, tìm kiếm và tải xuống các tài liệu học tập, giáo trình và bài giảng một cách nhanh chóng.</Paragraph>
//                   <Button type="primary" size="large" icon={<BookOutlined />} onClick={() => window.location.href = '/user/TaiLieu'}>Khám phá tài liệu</Button>
//                 </Col>
//                 <Col span={12} className={styles.carouselImage}>
//                   <div className={styles.imagePlaceholder}>
//                     <FileTextOutlined style={{ fontSize: 100 }} />
//                   </div>
//                 </Col>
//               </Row>
//             </div>
//             <div>
//               <Row align="middle" justify="center" className={styles.carouselItem}>
//                 <Col span={12}>
//                   <Title level={2}>Tài liệu học tập của bạn</Title>
//                   <Paragraph>Xem các tài liệu mà bạn đăng tải.</Paragraph>
//                   <Button type="primary" size="large" icon={<BookOutlined />} onClick={() => window.location.href = '/user/ThaoTacTaiLieu'}>Xem tài liệu của bạn</Button>
//                 </Col>
//                 <Col span={12} className={styles.carouselImage}>
//                   <div className={styles.imagePlaceholder}>
//                     <BookOutlined style={{ fontSize: 100 }} />
//                   </div>
//                 </Col>
//               </Row>
//             </div>
//           </Carousel>
//         </Card>
//         {/* Statistics section */}
//         <Row gutter={16} className={styles.statsRow}>
//           <Col span={6}>
//             <Card bordered={false}>
//               <Statistic title="Tổng số tài liệu" value={stats.totalDocs} prefix={<FileTextOutlined />} />
//             </Card>
//           </Col>
//           <Col span={6}>
//             <Card bordered={false}>
//               <Statistic title="Danh mục" value={stats.totalCategories} prefix={<BookOutlined />} />
//             </Card>
//           </Col>
//           <Col span={6}>
//             <Card bordered={false}>
//               <Statistic title="Lượt tải xuống" value={stats.totalDownloads} prefix={<DownloadOutlined />} />
//             </Card>
//           </Col>
//           <Col span={6}>
//             <Card bordered={false}>
//               <Statistic title="Tài liệu mới trong tháng" value={stats.newDocsThisMonth} prefix={<FireOutlined />} />
//             </Card>
//           </Col>
//         </Row>
//         <Row gutter={16}>
//           {/* Charts section */}
//           <Col span={12}>
//             <Card title="Top tài liệu được tải về nhiều nhất" bordered={false}>
//               <Bar
//                 data={topDownloadedDocs}
//                 xField="downloads"
//                 yField="title"
//                 seriesField="title"
//                 isStack={false}
//                 isGroup={false}
//                 color={(item: any) => {
//                   const colors = ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262fd'];
//                   const idx = topDownloadedDocs.findIndex(d => d && d.title === item.title);
//                   return colors[idx >= 0 ? idx % colors.length : 0];
//                 }}
//                 barStyle={{ radius: [4, 4, 4, 4] }}
//                 label={{
//                   position: 'right',
//                   style: {
//                     fill: '#595959',
//                     fontWeight: 500,
//                   },
//                 }}
//                 meta={{
//                   title: { alias: 'Tài liệu' },
//                   downloads: { alias: 'Lượt tải' },
//                 }}
//                 xAxis={{
//                   title: { text: 'Lượt tải', style: { fontWeight: 600 } },
//                   label: { style: { fontSize: 12, fontWeight: 500 } },
//                 }}
//                 yAxis={{
//                   title: { text: 'Tài liệu', style: { fontWeight: 600 } },
//                   label: { style: { fontSize: 12, fontWeight: 500 } },
//                 }}
//               />
//             </Card>
//           </Col>
//           <Col span={12}>
//             <Card title="Top danh mục có nhiều tài liệu nhất" bordered={false}>
//               <div style={{ width: '100%', height: 400 }}>
//                 <Column
//                   data={topCategoryDownloaded}
//                   xField="category"
//                   yField="value"
//                   seriesField="category"
//                   isStack={false}
//                   isGroup={false}
//                   columnWidthRatio={0.5}
//                   label={{
//                     position: 'top',
//                     style: {
//                       fill: '#595959',
//                       fontWeight: 500,
//                     },
//                   }}
//                   meta={{
//                     category: { alias: 'Danh mục' },
//                     value: { alias: 'Số tài liệu' },
//                   }}
//                   xAxis={{
//                     title: { text: 'Danh mục', style: { fontWeight: 600 } },
//                     label: { rotate: 0, style: { fontSize: 12, fontWeight: 500 } },
//                   }}
//                   yAxis={{
//                     title: { text: 'Số tài liệu', style: { fontWeight: 600 } },
//                   }}
//                 />
//               </div>
//             </Card>
//           </Col>
//         </Row>
//         {/* Popular categories section */}
//         <Card
//           title="Danh mục phổ biến"
//           bordered={false}
//           className={styles.categoriesSection}
//         >
//           <Row gutter={[16, 16]} justify="center">
//             {categoryData.slice(0, 5).map((category) => (
//               <Col span={4} key={category.category} style={{ minWidth: 180 }}>
//                 <Card
//                   hoverable
//                   className={styles.categoryCard}
//                 >
//                   <div className={styles.categoryContent}>
//                     <BookOutlined className={styles.categoryIcon} />
//                     <Title level={4}>{category.category}</Title>
//                     <Paragraph>{category.value} tài liệu</Paragraph>
//                     <Button type="primary" onClick={() => window.location.href = `/user/TaiLieu?category=${encodeURIComponent(category.category)}`}>Xem danh mục</Button>
//                   </div>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </Card>
//       </div>
//     </>
//   );
// };

// export default HomeContent;
import React, { useMemo } from 'react';
import { Card, Row, Col, Typography, Statistic, Button, Carousel } from 'antd';
import { BookOutlined, FileTextOutlined, DownloadOutlined, FireOutlined } from '@ant-design/icons';
import { Bar, Column } from '@ant-design/charts';
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
  documents?: Document[]; // nhận từ cha
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
  // Số tài liệu đã đăng lên = tổng số tài liệu truyền từ cha
  const totalUploads = documents.length;

  // Tổng số lượt tải xuống: tổng tất cả downloads (ưu tiên), fallback downloadCount
  const totalDownloads = useMemo(
    () =>
      documents.reduce(
        (sum, doc) => sum + (doc.downloads ?? doc.downloadCount ?? 0),
        0
      ),
    [documents]
  );

  // Top 5 tài liệu được tải về nhiều nhất
  const topDownloadedDocs = [...documents]
    .filter(doc => typeof (doc.downloads ?? doc.downloadCount) === 'number')
    .sort(
      (a, b) =>
        (b.downloads ?? b.downloadCount ?? 0) -
        (a.downloads ?? a.downloadCount ?? 0)
    )
    .slice(0, 5);

  // Top 5 danh mục phổ biến
  const topCategoryDownloaded = Array.isArray(categoryData)
    ? [...categoryData]
        .sort((a, b) => (b.value || 0) - (a.value || 0))
        .slice(0, 5)
    : [];

  return (
    <>
      <div className={styles.stickyHeader}>
        {menu}
        <div className={styles.headerRight}>
          {notificationContent}
          <FormThongTinNguoiDung totalDownloads={totalDownloads} totalUploads={totalUploads} />
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
                  <Button
                    type="primary"
                    size="large"
                    icon={<BookOutlined />}
                    onClick={() => window.location.href = '/user/ThaoTacTaiLieu'}
                  >
                    Xem tài liệu của bạn
                  </Button>
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
              <Statistic title="Tổng số tài liệu đã được duyệt" value={totalUploads} prefix={<FileTextOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic title="Danh mục đã được duyệt" value={stats.totalCategories} prefix={<BookOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic title="Lượt tải xuống" value={totalDownloads} prefix={<DownloadOutlined />} />
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
                data={topDownloadedDocs}
                xField="downloads"
                yField="title"
                seriesField="title"
                isStack={false}
                isGroup={false}
                color={(item: any) => {
                  const colors = ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262fd'];
                  const idx = topDownloadedDocs.findIndex(d => d && d.title === item.title);
                  return colors[idx >= 0 ? idx % colors.length : 0];
                }}
                barStyle={{ radius: [4, 4, 4, 4] }}
                label={{
                  position: 'right',
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
                  title: { text: 'Lượt tải', style: { fontWeight: 600 } },
                  label: { style: { fontSize: 12, fontWeight: 500 } },
                }}
                yAxis={{
                  title: { text: 'Tài liệu', style: { fontWeight: 600 } },
                  label: { style: { fontSize: 12, fontWeight: 500 } },
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
                  isStack={false}
                  isGroup={false}
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
                  xAxis={{
                    title: { text: 'Danh mục', style: { fontWeight: 600 } },
                    label: { rotate: 0, style: { fontSize: 12, fontWeight: 500 } },
                  }}
                  yAxis={{
                    title: { text: 'Số tài liệu', style: { fontWeight: 600 } },
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>
        {/* Popular categories section */}
        <Card
          title="Danh mục phổ biến"
          bordered={false}
          className={styles.categoriesSection}
        >
          <Row gutter={[16, 16]} justify="center">
            {categoryData.slice(0, 5).map((category) => (
              <Col span={4} key={category.category} style={{ minWidth: 180 }}>
                <Card
                  hoverable
                  className={styles.categoryCard}
                >
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