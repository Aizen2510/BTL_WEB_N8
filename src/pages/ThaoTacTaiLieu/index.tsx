import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Popconfirm,
  message,
  Card,
  Space,
  Tabs,
  Badge,
  Tooltip,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  FileExcelOutlined,
  SearchOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useRequest } from 'umi';
import type { UploadProps } from 'antd';
import { exportToExcel } from '@/utils/excel';
import './index.less';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  uploadedBy: string;
  uploadDate: string;
  fileType: string;
  fileSize: number;
  downloadCount: number;
  status: 'pending' | 'approved' | 'rejected';
  fileUrl: string;
}

interface Category {
  id: string;
  name: string;
}

const DocumentManagement: React.FC = () => {
  // State variables
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('1');
  
  // Mock API calls with useRequest (replace with actual API calls)
  const { loading: loadingDocuments, run: fetchDocuments } = useRequest(
    () => {
      // Mock API call to fetch documents
      return new Promise<Document[]>((resolve) => {
        setTimeout(() => {
          // Filtering logic based on search text and category
          const filtered = mockDocuments.filter(doc => {
            const matchSearch = doc.title.toLowerCase().includes(searchText.toLowerCase()) || 
                                doc.description.toLowerCase().includes(searchText.toLowerCase());
            const matchCategory = filterCategory === 'all' || doc.category === filterCategory;
            return matchSearch && matchCategory && doc.status === 'approved';
          });
          resolve(filtered);
        }, 500);
      });
    },
    {
      onSuccess: (data: any) => {
        setDocuments(data as Document[]);
      },
    }
  );

  const { loading: loadingPending, run: fetchPendingDocuments } = useRequest(
    () => {
      // Mock API call to fetch pending documents (for admin)
      return new Promise<Document[]>((resolve) => {
        setTimeout(() => {
          const pending = mockDocuments.filter(doc => doc.status === 'pending');
          resolve(pending);
        }, 500);
      });
    },
    {
      onSuccess: (data: any) => {
        setPendingDocuments(data as Document[]);
      },
    }
  );

  const { loading: loadingCategories, run: fetchCategories } = useRequest(
    () => {
      // Mock API call to fetch categories
      return new Promise<Category[]>((resolve) => {
        setTimeout(() => {
          resolve(mockCategories);
        }, 500);
      });
    },
    {
      onSuccess: (data: any) => {
        setCategories(data as Category[]);
      },
    }
  );

  // Mock data
  const mockDocuments: Document[] = [
    {
      id: '1',
      title: 'Giáo trình Lập trình Web',
      description: 'Tài liệu học tập về HTML, CSS và JavaScript',
      category: '1', // Web Development
      uploadedBy: 'admin',
      uploadDate: '2025-05-10',
      fileType: 'pdf',
      fileSize: 2500,
      downloadCount: 120,
      status: 'approved',
      fileUrl: '/files/web-programming.pdf'
    },
    {
      id: '2',
      title: 'Bài giảng Cơ sở dữ liệu',
      description: 'Bài giảng về các nguyên lý cơ sở dữ liệu',
      category: '2', // Database
      uploadedBy: 'teacher1',
      uploadDate: '2025-05-08',
      fileType: 'pptx',
      fileSize: 1800,
      downloadCount: 85,
      status: 'approved',
      fileUrl: '/files/database-lecture.pptx'
    },
    {
      id: '3',
      title: 'Tài liệu Trí tuệ nhân tạo',
      description: 'Tài liệu học tập về Deep Learning và Neural Networks',
      category: '3', // AI
      uploadedBy: 'admin',
      uploadDate: '2025-05-12',
      fileType: 'pdf',
      fileSize: 4200,
      downloadCount: 95,
      status: 'pending',
      fileUrl: '/files/ai-materials.pdf'
    },
    {
      id: '4',
      title: 'Hướng dẫn thực hành Python',
      description: 'Tài liệu thực hành lập trình Python cơ bản',
      category: '4', // Programming
      uploadedBy: 'teacher2',
      uploadDate: '2025-05-05',
      fileType: 'docx',
      fileSize: 1500,
      downloadCount: 150,
      status: 'approved',
      fileUrl: '/files/python-practice.docx'
    },
  ];

  const mockCategories: Category[] = [
    { id: '1', name: 'Lập trình Web' },
    { id: '2', name: 'Cơ sở dữ liệu' },
    { id: '3', name: 'Trí tuệ nhân tạo' },
    { id: '4', name: 'Ngôn ngữ lập trình' },
    { id: '5', name: 'An toàn thông tin' },
    { id: '6', name: 'Toán rời rạc' },
    { id: '7', name: 'Thực hành lập trình Web' },
    { id: '8', name: 'Tiếng Anh' },
  ];

  // Check if user is admin (in a real app, this would come from auth context)
  const isAdmin = true;

  // Upload props for document file upload
  const uploadProps: UploadProps = {
    name: 'file',
    // Không gửi lên server, giả lập thành công luôn
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess && onSuccess({}, file);
      }, 500);
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} đã tải lên thành công`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
  };

  // Effects
  useEffect(() => {
    fetchDocuments();
    fetchCategories();
    if (isAdmin) {
      fetchPendingDocuments();
    }
  }, [searchText, filterCategory]);

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];
  // Ensure pendingDocuments is always an array
  const safePendingDocuments = Array.isArray(pendingDocuments) ? pendingDocuments : [];

  // Event handlers
  const showAddModal = () => {
    setIsEditMode(false);
    setCurrentDocument(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (document: Document) => {
    setIsEditMode(true);
    setCurrentDocument(document);
    form.setFieldsValue({
      title: document.title,
      description: document.description,
      category: document.category,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (isEditMode && currentDocument) {
        // Handle edit document
        message.success('Tài liệu đã được cập nhật thành công');
        // ... giữ nguyên logic cập nhật ...
      } else {
        // Handle add new document
        const newDoc: Document = {
          id: (Date.now()).toString(),
          title: values.title,
          description: values.description,
          category: values.category,
          uploadedBy: 'Bạn',
          uploadDate: new Date().toISOString().slice(0, 10),
          fileType: values.file?.file?.type?.split('/').pop() || 'pdf',
          fileSize: values.file?.file?.size ? Math.round(values.file.file.size / 1024) : 0,
          downloadCount: 0,
          status: isAdmin ? 'approved' : 'pending',
          fileUrl: '#',
        };
        setDocuments(prev => [newDoc, ...prev]);
        if (!isAdmin) setPendingDocuments(prev => [newDoc, ...prev]);
        message.success('Tài liệu mới đã được thêm thành công');
      }
      setIsModalVisible(false);
      // Không cần fetchDocuments/fetchPendingDocuments nữa vì đã cập nhật state trực tiếp
    });
  };

  const handleDelete = (id: string) => {
    // Handle delete document
    message.success('Tài liệu đã được xóa thành công');
    fetchDocuments();
    if (isAdmin) {
      fetchPendingDocuments();
    }
  };

  const handleApprove = (id: string) => {
    // Handle approve document
    message.success('Tài liệu đã được phê duyệt thành công');
    fetchDocuments();
    fetchPendingDocuments();
  };

  const handleReject = (id: string) => {
    // Handle reject document
    message.success('Tài liệu đã bị từ chối');
    fetchPendingDocuments();
  };

  const handleDownload = (document: Document) => {
    // Handle download document logic
    message.success(`Đang tải xuống: ${document.title}`);
    // In a real app, increment download count
    // window.open(document.fileUrl, '_blank');
  };

  const handleExportExcel = () => {
    // Export current filtered documents to Excel
    const dataToExport = documents.map(doc => ({
      'Tiêu đề': doc.title,
      'Mô tả': doc.description,
      'Danh mục': categories.find(c => c.id === doc.category)?.name || '',
      'Người đăng': doc.uploadedBy,
      'Ngày đăng': doc.uploadDate,
      'Định dạng': doc.fileType,
      'Kích thước (KB)': doc.fileSize,
      'Lượt tải': doc.downloadCount,
    }));

    exportToExcel(dataToExport, 'DanhSachTaiLieu');
  };

  // Table columns
  const documentColumns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Document) => (
        <Space>
          <FileTextOutlined />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
      title: 'Ngày đăng',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
    },
    {
      title: 'Định dạng',
      dataIndex: 'fileType',
      key: 'fileType',
      render: (text: string) => text.toUpperCase(),
    },
    {
      title: 'Lượt tải',
      dataIndex: 'downloadCount',
      key: 'downloadCount',
      sorter: (a: Document, b: Document) => a.downloadCount - b.downloadCount,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Document) => (
        <Space size="small">
          <Tooltip title="Tải xuống">
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              size="small" 
              onClick={() => handleDownload(record)}
            />
          </Tooltip>
          
          {isAdmin && (
            <>
              <Tooltip title="Chỉnh sửa">
                <Button 
                  icon={<EditOutlined />} 
                  size="small" 
                  onClick={() => showEditModal(record)}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa tài liệu này?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    size="small" 
                  />
                </Popconfirm>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const pendingDocumentColumns = [
    ...documentColumns.slice(0, -1),
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Document) => (
        <Space size="small">
          <Tooltip title="Phê duyệt">
            <Button 
              type="primary" 
              icon={<CheckOutlined />} 
              size="small" 
              onClick={() => handleApprove(record.id)}
            />
          </Tooltip>
          <Tooltip title="Từ chối">
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small" 
              onClick={() => handleReject(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="document-management">
      <Card>
        <Title level={2}>Hệ Thống Quản Lý Tài Liệu</Title>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Tài liệu" key="1">
            <div className="document-actions">
              <Space size="middle" className="search-filter">
                <Input
                  placeholder="Tìm kiếm tài liệu..."
                  prefix={<SearchOutlined />}
                  onChange={e => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                />
                <Select
                  placeholder="Lọc theo danh mục"
                  style={{ width: 200 }}
                  onChange={value => setFilterCategory(value)}
                  defaultValue="all"
                >
                  <Option value="all">Tất cả danh mục</Option>
                  {safeCategories.map(category => (
                    <Option key={category.id} value={category.id}>{category.name}</Option>
                  ))}
                </Select>
              </Space>
              
              <Space>
                <Button 
                  icon={<FileExcelOutlined />} 
                  onClick={handleExportExcel}
                >
                  Xuất Excel
                </Button>
                
                {isAdmin && (
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={showAddModal}
                  >
                    Thêm tài liệu
                  </Button>
                )}
              </Space>
            </div>
            
            <Table
              columns={documentColumns}
              dataSource={documents}
              rowKey="id"
              loading={loadingDocuments}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          
          {isAdmin && (
            <TabPane 
              tab={
                <Badge count={safePendingDocuments.length} offset={[10, 0]}>
                  <span>Chờ duyệt</span>
                </Badge>
              } 
              key="2"
            >
              <Table
                columns={pendingDocumentColumns}
                dataSource={safePendingDocuments}
                rowKey="id"
                loading={loadingPending}
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
          )}
        </Tabs>
      </Card>

      <Modal
        title={isEditMode ? "Chỉnh sửa tài liệu" : "Thêm tài liệu mới"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={isEditMode ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề tài liệu!' }]}
          >
            <Input placeholder="Nhập tiêu đề tài liệu" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả tài liệu!' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả tài liệu" />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục" defaultValue={safeCategories[0]?.id}>
              {/* Danh mục mặc định */}
              <Option value="6">Toán rời rạc</Option>
              <Option value="7">Thực hành lập trình Web</Option>
              <Option value="8">Tiếng Anh</Option>
              {/* Các danh mục còn lại */}
              {safeCategories.filter(c => !['6','7','8'].includes(c.id)).map(category => (
                <Option key={category.id} value={category.id}>{category.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          {!isEditMode && (
            <Form.Item
              name="file"
              label="Tệp tài liệu"
              rules={[{ required: true, message: 'Vui lòng tải lên tệp tài liệu!' }]}
            >
              <Upload {...uploadProps} maxCount={1}>
                <Button icon={<UploadOutlined />}>Chọn tệp</Button>
              </Upload>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default DocumentManagement;