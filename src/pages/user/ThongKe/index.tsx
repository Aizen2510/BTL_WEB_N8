import React from 'react';
import ThongKeContent from './ThongKe';
import { UploadOutlined, BarChartOutlined, HomeOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import ThongbaoPopover from '@/components/Thongbao';
import useThongKeModel from '@/models/ThongKe';
import './index.less';

const StatisticsPage: React.FC = () => {
  const model = useThongKeModel();

  const menu = (
    <div className="headerMenu">
      <Button type="link" icon={<HomeOutlined />} href="/user/Home" style={{ fontWeight: 600 }}>Trang chủ</Button>
      <Button type="link" icon={<FileSearchOutlined />} href="/user/TaiLieu" style={{ fontWeight: 600 }}>Tài liệu</Button>
      <Button type="link" icon={<BarChartOutlined />} href="/user/ThongKe" style={{ color: '#1890ff', fontWeight: 600 }}>Thống kê</Button>
      <Button type="link" icon={<UploadOutlined />} href="/user/ThaoTacTaiLieu" style={{ fontWeight: 600 }}>Thao tác tài liệu</Button>
    </div>
  );

  const handleAvatarClick = () => {
    window.location.href = '/login';
  };

  const notificationContent = (
    <ThongbaoPopover
      notifications={model.notifications}
      showNotifications={model.showNotifications}
      setShowNotifications={model.setShowNotifications}
      handleNotificationClick={(id, type) => {
        window.location.href = `/user/TaiLieu?id=${id}&type=${type}`;
      }}
    />
  );

  // Pie/column config
  const pieConfig = {
    appendPadding: 10,
    data: model.chartType === 'category' ? model.categoryData : model.uploaderData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };
  const columnConfig = {
    data: model.chartType === 'category' ? model.categoryData : model.uploaderData,
    xField: 'type',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      type: { alias: model.chartType === 'category' ? 'Danh mục' : 'Người tải lên' },
      value: { alias: 'Số lượng' },
    },
  };

  const columns = [
    {
      title: 'Tên tài liệu',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Biểu mẫu hành chính', value: 'Biểu mẫu hành chính' },
        { text: 'Văn bản quy phạm', value: 'Văn bản quy phạm' },
        { text: 'Quy trình nghiệp vụ', value: 'Quy trình nghiệp vụ' },
        { text: 'Tài liệu đào tạo', value: 'Tài liệu đào tạo' },
      ],
    },
    {
      title: 'Ngày tải lên',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      sorter: true,
    },
    {
      title: 'Lượt tải',
      dataIndex: 'downloads',
      key: 'downloads',
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đã duyệt', value: 'Đã duyệt' },
        { text: 'Chờ duyệt', value: 'Chờ duyệt' },
        { text: 'Đã từ chối', value: 'Đã từ chối' },
      ],
    },
  ];

  return (
    <ThongKeContent
      menu={menu}
      notificationContent={notificationContent}
      showNotifications={model.showNotifications}
      setShowNotifications={model.setShowNotifications}
      handleAvatarClick={handleAvatarClick}
      totalDocuments={model.totalDocuments}
      totalApproved={model.totalApproved}
      totalPending={model.totalPending}
      totalRejected={model.totalRejected}
      chartType={model.chartType}
      setChartType={model.setChartType}
      timeRange={model.timeRange}
      handleTimeRangeChange={model.handleTimeRangeChange}
      handleExportExcel={model.handleExportExcel}
      pieConfig={pieConfig}
      columnConfig={columnConfig}
      columns={columns}
      documents={model.documents}
      pagination={model.pagination}
      loading={model.loading}
      handleTableChange={model.handleTableChange}
    />
  );
};

export default StatisticsPage;