import React, { useEffect, useRef } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  message,
  Popconfirm,
  Typography,
  Tag,
  Row,
  Col,
  Select,
  Form,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  BarChartOutlined,
  HomeOutlined,
  FileSearchOutlined,
  UploadOutlined,
  BellOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';
import { useModel, useHistory } from 'umi';
import { Document } from '@/services/ThaoTacTaiLieu/typings';
import FormDocument from './Form';
import ThongbaoPopover from '@/components/Thongbao';
import FormThongTinNguoiDung from '@/components/FormThongtinnguoidung';

const { Title, Text } = Typography;

const DocumentList: React.FC = () => {
  const {
    documents,
    setDocuments,
    isLoading,
    setLoading,
    isModalVisible,
    setIsModalVisible,
    categories,
    setCategories,
    searchText,
    setSearchText,
    fetchDocuments,
    fetchCategories,
    selectedDocument,
    setSelectedDocument,
  } = useModel('ThaoTacTaiLieu');
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, []);

  const showModal = (document?: Document) => {
    setSelectedDocument(document || null);
    setIsModalVisible(true);
    if (!document) {
      setTimeout(() => {
        form && form.resetFields && form.resetFields();
      }, 0);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDocuments((prev: Document[]) => prev.filter(doc => doc.id !== id));
      message.success('Xóa tài liệu thành công!');
    } catch (error) {
      message.error('Xóa thất bại!');
    }
  };

  // Thêm state và logic lọc theo trạng thái
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>(undefined);

  // Lọc dữ liệu theo searchText và statusFilter trước khi truyền vào Table
  const filteredDocuments = documents.filter(doc => {
    const search = searchText?.toLowerCase() || '';
    const matchSearch = doc.title.toLowerCase().includes(search) || doc.description.toLowerCase().includes(search);
    const matchStatus = statusFilter ? doc.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const columns: ColumnsType<Document> = [
    {
      title: 'Tài Liệu',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <div dangerouslySetInnerHTML={{ __html: text }} style={{ maxHeight: 60, overflow: 'auto' }} />
      ),
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      sorter: (a, b) => moment(a.uploadDate, 'YYYY-MM-DD').unix() - moment(b.uploadDate, 'YYYY-MM-DD').unix(),
      render: (date) => {
        const d = moment(date, ['YYYY-MM-DD', 'DD/MM/YYYY', moment.ISO_8601], true);
        return d.isValid() ? d.format('DD/MM/YYYY') : '';
      },
    },
    {
      title: 'Người đăng',
      dataIndex: 'uploadedBy',
      key: 'uploadedBy',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'approved') return <Tag color="green">Đã duyệt</Tag>;
        if (status === 'pending') return <Tag color="orange">Chờ duyệt</Tag>;
        if (status === 'rejected') return <Tag color="red">Từ chối</Tag>;
        return status;
      },
      filters: [
        { text: 'Đã duyệt', value: 'approved' },
        { text: 'Chờ duyệt', value: 'pending' },
        { text: 'Từ chối', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EyeOutlined />} size="small" href={record.fileUrl} target="_blank" />
          <Button icon={<EditOutlined />} size="small" onClick={() => showModal(record)} />
          <Popconfirm
            title="Xác nhận xóa tài liệu này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const prevDocumentsRef = useRef<Document[]>([]);

  // Helper để phát hiện thay đổi
  function diffDocuments(prev: Document[], curr: Document[]) {
    const changes: any[] = [];
    const prevMap = new Map(prev.map(doc => [doc.id, doc]));
    const currMap = new Map(curr.map(doc => [doc.id, doc]));
    // Thêm mới
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
    // Xóa
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
    // Sửa
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

  // Click notification: chuyển hướng đến TaiLieu với id/type
  const handleNotificationClick = (id: string, type: string) => {
    window.location.href = `/user/TaiLieu?id=${id}&type=${type}`;
  };

  // Tổng số lượt tải xuống CHỈ của tài liệu đã duyệt
  const totalDownloads = documents
    .filter(doc => doc.status === 'approved')
    .reduce((sum, doc) => sum + (doc.downloads ?? doc.downloadCount ?? 0), 0);

  return (
    <div>
      {/* Sticky Header */}
      <div className="stickyHeader" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="headerMenu" style={{ display: 'flex', gap: 16 }}>
          <Button type="link" icon={<HomeOutlined />} href="/user/Home" style={{ fontWeight: 600 }}>Trang chủ</Button>
          <Button type="link" icon={<FileSearchOutlined />} href="/user/TaiLieu" style={{ fontWeight: 600 }}>Tài liệu</Button>
          <Button type="link" icon={<BarChartOutlined />} href="/user/ThongKe" style={{ fontWeight: 600 }}>Thống kê</Button>
          <Button type="link" icon={<UploadOutlined />} href="/user/ThaoTacTaiLieu" style={{ color: '#1890ff', fontWeight: 600 }}>Thao tác tài liệu</Button>
        </div>
        <div className="headerRight" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ThongbaoPopover
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            handleNotificationClick={handleNotificationClick}
          />
          <FormThongTinNguoiDung totalDownloads={totalDownloads} />
        </div>
      </div>
      {/* End Sticky Header */}
      
      <div style={{ padding: '14px' }}>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Title level={2}>Quản lý tài liệu</Title>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Space>
              <Input
                placeholder="Tìm kiếm theo tiêu đề hoặc mô tả"
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
                allowClear
              />
              {/* Bộ lọc theo trạng thái */}
              <Select
                placeholder="Lọc theo trạng thái"
                allowClear
                style={{ width: 160 }}
                value={statusFilter}
                onChange={value => setStatusFilter(value)}
              >
                <Select.Option value="approved">Đã duyệt</Select.Option>
                <Select.Option value="pending">Chờ duyệt</Select.Option>
                <Select.Option value="rejected">Từ chối</Select.Option>
              </Select>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                Thêm tài liệu
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredDocuments}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <Text strong>Tệp đính kèm: </Text>
                <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">
                  Tải xuống
                </a>
              </div>
            ),
          }}
        />

        <Modal
          title={selectedDocument ? 'Chỉnh sửa tài liệu' : 'Thêm tài liệu mới'}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
        >
          <FormDocument initialValues={selectedDocument} categories={categories} form={form} />
        </Modal>
      </div>
    </div>
  );
};

export default DocumentList;