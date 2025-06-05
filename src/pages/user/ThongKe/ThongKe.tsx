import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useModel, history } from 'umi';
import { Button, message } from 'antd';
import {
  UploadOutlined,
  HomeOutlined,
  FileSearchOutlined,
  BarChartOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import ThongKeContent from './ThongKeContent';
import ThongbaoPopover from '@/components/Thongbao';

const ThongKe: React.FC = () => {
  // Lấy toàn bộ documents, categories, loading state từ model ThaoTacTaiLieu
  const {
    documents = [],
    fetchDocuments,
    fetchCategories,
    categories = [],
    isLoading,
  } = useModel('ThaoTacTaiLieu');

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const prevDocumentsRef = useRef<any[]>([]);

  // Helper để phát hiện thay đổi
  function diffDocuments(prev: any[], curr: any[]) {
    const changes: any[] = [];
    const prevMap = new Map(prev.map(doc => [doc.id, doc]));
    const currMap = new Map(curr.map(doc => [doc.id, doc]));
    curr.forEach(doc => {
      if (!prevMap.has(doc.id)) {
        changes.push({
          id: doc.id,
          type: 'add',
          title: doc.title,
          date: doc.uploadDate,
        });
      }
    });
    prev.forEach(doc => {
      if (!currMap.has(doc.id)) {
        changes.push({
          id: doc.id,
          type: 'delete',
          title: doc.title,
          date: doc.uploadDate,
        });
      }
    });
    curr.forEach(doc => {
      const prevDoc = prevMap.get(doc.id);
      if (prevDoc && JSON.stringify(doc) !== JSON.stringify(prevDoc)) {
        changes.push({
          id: doc.id,
          type: 'edit',
          title: doc.title,
          date: doc.uploadDate,
        });
      }
    });
    return changes;
  }

  // Cập nhật notifications khi documents thay đổi
  useEffect(() => {
    const prevDocs = prevDocumentsRef.current;
    const changes = diffDocuments(prevDocs, documents);
    if (changes.length > 0) {
      setNotifications(prev => {
        const merged = [...changes.reverse(), ...prev].slice(0, 6);
        const unique = [];
        const seen = new Set();
        for (const n of merged) {
          const key = n.id + n.type + n.date;
          if (!seen.has(key)) {
            unique.push(n);
            seen.add(key);
          }
        }
        return unique.slice(0, 6);
      });
    }
    prevDocumentsRef.current = documents;
  }, [documents]);

  // Khi mount, fetch dữ liệu
  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, []);

  // Thống kê cơ bản
  const totalDocuments = useMemo(() => documents.length, [documents]);
  const totalApproved = useMemo(
    () => documents.filter(doc => doc.status === 'approved').length,
    [documents],
  );
  const totalPending = useMemo(
    () => documents.filter(doc => doc.status === 'pending').length,
    [documents],
  );
  const totalRejected = useMemo(
    () => documents.filter(doc => doc.status === 'rejected').length,
    [documents],
  );

  // Tính tổng số lượt tải xuống CHỈ của tài liệu đã duyệt (giống Thống kê)
  const totalDownloads = useMemo(
    () =>
      documents
        .filter(doc => doc.status === 'approved')
        .reduce((sum, doc) => sum + (doc.downloads ?? doc.downloadCount ?? 0), 0),
    [documents]
  );

  // Chart Data
  const [chartType, setChartType] = useState<'category' | 'uploader'>('category');

  // Time range (DatePicker.RangePicker)
  const [timeRange, setTimeRange] = useState<any>(null);
  const handleTimeRangeChange = (dates: any) => {
    setTimeRange(dates);
  };

  // Pie Chart config
  const pieConfig = useMemo(() => {
    if (chartType === 'category') {
      const mapCat: Record<string, number> = {};
      documents.forEach(doc => {
        const cat = doc.category || 'Chưa xác định';
        mapCat[cat] = (mapCat[cat] || 0) + 1;
      });
      const data = Object.entries(mapCat).map(([category, count]) => ({
        type: category,
        value: count,
      }));
      return {
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
          visible: true,
          type: 'outer',
        },
      };
    }
    const mapUser: Record<string, number> = {};
    documents.forEach(doc => {
      const user = doc.uploadedBy || 'Chưa xác định';
      mapUser[user] = (mapUser[user] || 0) + 1;
    });
    const data = Object.entries(mapUser).map(([uploader, count]) => ({
      type: uploader,
      value: count,
    }));
    return {
      data,
      angleField: 'value',
      colorField: 'type',
      radius: 0.8,
      label: {
        visible: true,
        type: 'outer',
      },
    };
  }, [chartType, documents]);

  // Column Chart config
  const columnConfig = useMemo(() => {
    if (chartType === 'category') {
      const mapCat: Record<string, number> = {};
      documents.forEach(doc => {
        const cat = doc.category || 'Chưa xác định';
        mapCat[cat] = (mapCat[cat] || 0) + 1;
      });
      const data = Object.entries(mapCat).map(([category, count]) => ({
        category,
        value: count,
      }));
      return {
        data,
        xField: 'category',
        yField: 'value',
        label: {
          position: 'top',
          style: { fill: '#595959', fontWeight: 500 },
        },
        xAxis: {
          title: { text: 'Danh mục', style: { fontWeight: 600 } },
          label: { rotate: 0, style: { fontSize: 12, fontWeight: 500 } },
        },
        yAxis: {
          title: { text: 'Số tài liệu', style: { fontWeight: 600 } },
        },
      };
    } else {
      const mapUser: Record<string, number> = {};
      documents.forEach(doc => {
        const user = doc.uploadedBy || 'Chưa xác định';
        mapUser[user] = (mapUser[user] || 0) + 1;
      });
      const data = Object.entries(mapUser).map(([uploader, count]) => ({
        uploader,
        value: count,
      }));
      return {
        data,
        xField: 'uploader',
        yField: 'value',
        label: {
          position: 'top',
          style: { fill: '#595959', fontWeight: 500 },
        },
        xAxis: {
          title: { text: 'Người tải lên', style: { fontWeight: 600 } },
          label: { rotate: 0, style: { fontSize: 12, fontWeight: 500 } },
        },
        yAxis: {
          title: { text: 'Số tài liệu', style: { fontWeight: 600 } },
        },
      };
    }
  }, [chartType, documents]);

  // Table columns
  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Người tải lên',
      dataIndex: 'uploadedBy',
      key: 'uploadedBy',
    },
    {
      title: 'Lượt tải xuống',
      dataIndex: 'downloadCount',
      key: 'downloadCount',
      render: (value: number) => value || 0,
      sorter: (a: any, b: any) => (a.downloadCount || 0) - (b.downloadCount || 0),
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'approved') return <span style={{ color: '#52c41a' }}>Đã duyệt</span>;
        if (status === 'pending') return <span style={{ color: '#faad14' }}>Chờ duyệt</span>;
        if (status === 'rejected') return <span style={{ color: '#ff4d4f' }}>Từ chối</span>;
        return status;
      },
      filters: [
        { text: 'Đã duyệt', value: 'approved' },
        { text: 'Chờ duyệt', value: 'pending' },
        { text: 'Từ chối', value: 'rejected' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
  ];

  // Pagination + Loading
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: documents.length });
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    setLoading(isLoading);
    setPagination(prev => ({ ...prev, total: documents.length }));
  }, [isLoading, documents.length]);

  const handleTableChange = (newPag: any) => {
    setPagination(newPag);
  };

  // Xuất Excel (ví dụ)
  const handleExportExcel = () => {
    message.info('Bạn vừa bấm Xuất Excel (chưa cài đặt thực tế)');
  };

  // Notification click
  const handleNotificationClick = (id: string, type: string) => {
    history.push(`/user/TaiLieu?id=${id}&type=${type}`);
  };

  return (
    <ThongKeContent
      menu={
        <div style={{ display: 'flex', gap: 16 }}>
          <Button type="link" icon={<HomeOutlined />} href="/user/Home" style={{ fontWeight: 600 }}>
            Trang chủ
          </Button>
          <Button type="link" icon={<FileSearchOutlined />} href="/user/TaiLieu" style={{ fontWeight: 600 }}>
            Tài liệu
          </Button>
          <Button
            type="link"
            icon={<BarChartOutlined />}
            href="/user/ThongKe"
            style={{ color: '#1890ff', fontWeight: 600 }}
          >
            Thống kê
          </Button>
          <Button type="link" icon={<UploadOutlined />} href="/user/ThaoTacTaiLieu" style={{ fontWeight: 600 }}>
            Thao tác tài liệu
          </Button>
        </div>
      }
      notificationContent={
        <ThongbaoPopover
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          handleNotificationClick={handleNotificationClick}
        />
      }
      showNotifications={showNotifications}
      setShowNotifications={setShowNotifications}
      handleAvatarClick={() => history.push('/login')}
      totalDocuments={totalDocuments}
      totalApproved={totalApproved}
      totalPending={totalPending}
      totalRejected={totalRejected}
      chartType={chartType}
      setChartType={setChartType}
      timeRange={timeRange}
      handleTimeRangeChange={handleTimeRangeChange}
      handleExportExcel={handleExportExcel}
      pieConfig={pieConfig}
      columnConfig={columnConfig}
      columns={columns}
      documents={documents}
      pagination={pagination}
      loading={loading}
      handleTableChange={handleTableChange}
      totalDownloads={totalDownloads}
    />
  );
};

export default ThongKe;