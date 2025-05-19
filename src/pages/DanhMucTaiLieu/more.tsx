import { Table, Empty } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  categoryId: string;
}

const CategoryDetail: React.FC<Props> = ({ categoryId }) => {
  const [documents, setDocuments] = useState<Document.Record[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      const rawData = localStorage.getItem('data') || '[]';
      const allDocs: Document.Record[] = JSON.parse(rawData);
      const filtered = allDocs.filter((doc) => doc.categoryId === categoryId);
      setDocuments(filtered);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu tài liệu:', error);
      setDocuments([]);
    }
    setLoading(false);
  }, [categoryId]);

  const columns = [
    { title: 'Tên tài liệu', dataIndex: 'title', key: 'title' },
    { title: 'Người đăng', dataIndex: 'uploaderName', key: 'uploaderName' },
    {
      title: 'Ngày đăng',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (val: string) => (val ? new Date(val).toLocaleDateString() : ''),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isApproved',
      key: 'isApproved',
      render: (val: boolean) => (val ? 'Đã duyệt' : 'Chờ duyệt'),
    },
    {
      title: 'Xem',
      key: 'action',
      render: (_: any, record: Document.Record) => (
        <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">
          Xem File
        </a>
      ),
    },
  ];

  return documents.length > 0 ? (
    <Table dataSource={documents} columns={columns} rowKey="id" loading={loading} />
  ) : (
    <Empty description="Không có tài liệu thuộc danh mục này" />
  );
};

export default CategoryDetail;
