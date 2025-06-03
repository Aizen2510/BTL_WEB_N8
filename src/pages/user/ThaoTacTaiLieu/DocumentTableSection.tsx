import React from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Popconfirm,
  Typography,
  Tag,
  Row,
  Col,
  message,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';
import { useModel } from 'umi';
import { Document } from '@/services/ThaoTacTaiLieu/typings';
import FormDocument from './Form';

const { Title, Text } = Typography;

const DocumentTableSection: React.FC = () => {
  const {
    documents,
    setDocuments,
    isLoading,
    isModalVisible,
    setIsModalVisible,
    categories,
    searchText,
    setSearchText,
    selectedDocument,
    setSelectedDocument,
  } = useModel('ThaoTacTaiLieu');

  const showModal = (document?: Document) => {
    setSelectedDocument(document || null);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setDocuments((prev: Document[]) => prev.filter(doc => doc.id !== id));
      message.success('Xóa tài liệu thành công!');
    } catch (error) {
      message.error('Xóa thất bại!');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const search = searchText?.toLowerCase() || '';
    return (
      doc.title.toLowerCase().includes(search) ||
      doc.description.toLowerCase().includes(search)
    );
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

  return (
    <div style={{ padding: '14px' }}>
      <Row gutter={[16, 16]} align="middle">
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
        <FormDocument initialValues={selectedDocument} categories={categories} />
      </Modal>
    </div>
  );
};

export default DocumentTableSection;
