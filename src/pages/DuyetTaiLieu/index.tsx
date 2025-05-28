import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Tag, Modal, Typography, Descriptions, Tooltip, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, HomeOutlined, FileSearchOutlined, BarChartOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import './index.less';

const { Title, Paragraph } = Typography;

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  uploadDate: string;
  uploadBy: string;
  status: 'pending' | 'approved' | 'rejected';
  fileUrl: string;
  fileType: string;
}

// Dữ liệu mẫu
const mockData: Document[] = [
  {
    id: '1',
    title: 'Biểu mẫu đơn xin nghỉ phép',
    description: 'Biểu mẫu đơn xin nghỉ phép dành cho nhân viên',
    category: 'Biểu mẫu hành chính',
    uploadDate: '2025-05-15',
    uploadBy: 'Nguyễn Văn A',
    status: 'pending',
    fileUrl: 'https://example.com/file1.pdf',
    fileType: 'pdf',
  },
  {
    id: '2',
    title: 'Quy trình thanh toán nội bộ',
    description: 'Tài liệu quy trình thanh toán nội bộ ban hành mới',
    category: 'Quy trình nghiệp vụ',
    uploadDate: '2025-05-16',
    uploadBy: 'Trần Thị B',
    status: 'pending',
    fileUrl: 'https://example.com/file2.docx',
    fileType: 'docx',
  },
  {
    id: '3',
    title: 'Biểu mẫu báo cáo tháng',
    description: 'Biểu mẫu báo cáo kết quả công việc hàng tháng',
    category: 'Biểu mẫu hành chính',
    uploadDate: '2025-05-17',
    uploadBy: 'Lê Văn C',
    status: 'pending',
    fileUrl: 'https://example.com/file3.xlsx',
    fileType: 'xlsx',
  },
  {
    id: '4',
    title: 'Tài liệu hướng dẫn sử dụng phần mềm',
    description: 'Tài liệu hướng dẫn sử dụng phần mềm quản lý nhân sự',
    category: 'Tài liệu đào tạo',
    uploadDate: '2025-05-17',
    uploadBy: 'Phạm Thị D',
    status: 'pending',
    fileUrl: 'https://example.com/file4.pdf',
    fileType: 'pdf',
  },
];

const PendingApprovalPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDocuments(mockData);
      setPagination({
        ...pagination,
        total: mockData.length,
      });
    } catch (error) {
      message.error('Lỗi khi tải danh sách tài liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, (string | number | boolean)[] | null>,
    sorter: SorterResult<Document> | SorterResult<Document>[],
  ) => {
    setPagination(newPagination);
    // Thực hiện lọc và sắp xếp dữ liệu ở đây
  };

  const handlePreview = (record: Document) => {
    setCurrentDocument(record);
    setPreviewVisible(true);
  };

  const handleDetail = (record: Document) => {
    setCurrentDocument(record);
    setDetailVisible(true);
  };

  const handleApprove = async (id: string) => {
    setLoading(true);
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Cập nhật trạng thái trong state
      const updatedDocuments = documents.map(doc => 
        doc.id === id ? { ...doc, status: 'approved' as const } : doc
      );
      setDocuments(updatedDocuments);
      
      message.success('Đã duyệt tài liệu thành công');
    } catch (error) {
      message.error('Lỗi khi duyệt tài liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setLoading(true);
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Cập nhật trạng thái trong state
      const updatedDocuments = documents.map(doc => 
        doc.id === id ? { ...doc, status: 'rejected' as const } : doc
      );
      setDocuments(updatedDocuments);
      
      message.success('Đã từ chối tài liệu thành công');
    } catch (error) {
      message.error('Lỗi khi từ chối tài liệu');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên tài liệu',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      render: (text: string, record: Document) => (
        <a onClick={() => handleDetail(record)}>{text}</a>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Biểu mẫu hành chính', value: 'Biểu mẫu hành chính' },
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
      title: 'Người tải lên',
      dataIndex: 'uploadBy',
      key: 'uploadBy',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let text = 'Không xác định';
        
        switch (status) {
          case 'pending':
            color = 'gold';
            text = 'Chờ duyệt';
            break;
          case 'approved':
            color = 'green';
            text = 'Đã duyệt';
            break;
          case 'rejected':
            color = 'red';
            text = 'Đã từ chối';
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Chờ duyệt', value: 'pending' },
        { text: 'Đã duyệt', value: 'approved' },
        { text: 'Đã từ chối', value: 'rejected' },
      ],
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Document) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="Duyệt">
            <Button 
              type="text" 
              icon={<CheckCircleOutlined />} 
              className="approve-button"
              onClick={() => handleApprove(record.id)}
              disabled={record.status !== 'pending'}
            />
          </Tooltip>
          <Tooltip title="Từ chối">
            <Button 
              type="text" 
              icon={<CloseCircleOutlined />} 
              className="reject-button"
              onClick={() => handleReject(record.id)}
              disabled={record.status !== 'pending'}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Header navigation menu
  const menu = (
    <div className="headerMenu">
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
    <PageContainer title={false}>
      <div className="stickyHeader">
        {menu}
        <div className="headerRight">
          <div className="avatar" onClick={handleAvatarClick} title="Đăng nhập">
            <img src={require('@/assets/admin.png')} alt="avatar" />
          </div>
        </div>
      </div>
      <div className="pendingApprovalPage">
        <Card className="tableCard">
          <Table
            columns={columns}
            dataSource={documents}
            rowKey="id"
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </Card>

        {/* Modal xem chi tiết tài liệu */}
        <Modal
          title={
            <Space>
              <FileTextOutlined /> 
              Chi tiết tài liệu
            </Space>
          }
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="back" onClick={() => setDetailVisible(false)}>
              Đóng
            </Button>,
            currentDocument?.status === 'pending' && (
              <Button 
                key="approve" 
                type="primary" 
                onClick={() => {
                  handleApprove(currentDocument.id);
                  setDetailVisible(false);
                }}
              >
                Duyệt
              </Button>
            ),
            currentDocument?.status === 'pending' && (
              <Button 
                key="reject" 
                danger 
                onClick={() => {
                  handleReject(currentDocument.id);
                  setDetailVisible(false);
                }}
              >
                Từ chối
              </Button>
            ),
          ]}
          width={700}
        >
          {currentDocument && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Tên tài liệu">{currentDocument.title}</Descriptions.Item>
              <Descriptions.Item label="Mô tả">{currentDocument.description}</Descriptions.Item>
              <Descriptions.Item label="Danh mục">{currentDocument.category}</Descriptions.Item>
              <Descriptions.Item label="Người tải lên">{currentDocument.uploadBy}</Descriptions.Item>
              <Descriptions.Item label="Ngày tải lên">{currentDocument.uploadDate}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={
                  currentDocument.status === 'approved' ? 'green' : 
                  currentDocument.status === 'rejected' ? 'red' : 'gold'
                }>
                  {currentDocument.status === 'approved' ? 'Đã duyệt' : 
                   currentDocument.status === 'rejected' ? 'Đã từ chối' : 'Chờ duyệt'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>

        {/* Modal xem trước tài liệu */}
        <Modal
          title={
            <Space>
              <EyeOutlined /> 
              Xem trước: {currentDocument?.title}
            </Space>
          }
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={[
            <Button key="back" onClick={() => setPreviewVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={800}
          bodyStyle={{ height: '70vh' }}
        >
          {currentDocument && (
            <div className="document-preview">
              {currentDocument.fileType === 'pdf' ? (
                <div className="pdf-viewer">
                  <iframe
                    src={currentDocument.fileUrl}
                    width="100%"
                    height="100%"
                    title={currentDocument.title}
                  />
                </div>
              ) : (
                <div className="file-placeholder">
                  <FileTextOutlined className="file-icon" />
                  <p>Không thể xem trước tệp {currentDocument.fileType.toUpperCase()}</p>
                  <Button type="primary" href={currentDocument.fileUrl} target="_blank">
                    Tải xuống
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </PageContainer>
  );
};

export default PendingApprovalPage;