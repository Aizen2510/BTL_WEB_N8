import { DownloadOutlined } from '@ant-design/icons';
import { Table, Empty, Button } from 'antd';
import { useEffect, useState } from 'react';
import type { TableColumnType } from 'antd';

interface Props {
  categoryId: string;
}

const CategoryDetail: React.FC<Props> = ({ categoryId }) => {
  const [documents, setDocuments] = useState<Document.Record[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDocs = () => {
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
    };

    if (categoryId) fetchDocs();
  }, [categoryId]);

  useEffect(() => {
    console.log('CategoryDetail: categoryId =', categoryId);
  }, [categoryId]);

  const columns: TableColumnType<Document.Record>[] = [
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
      render: (val: string) => {
        if (val === 'approved') return 'Đã duyệt';
        if (val === 'rejected') return 'Từ chối';
        return 'Chờ duyệt';
      },
    },
    {
      title: 'Hành Động',
      key: 'action',
      align: 'center' as const,
      render: (text, record) => {
        const filePath = record.fileUrl
          ? record.fileUrl.replace('http://localhost:3000/uploads/', '')
          : '';
        return record.fileUrl ? (
          <a
            href={`http://localhost:3000/download/${encodeURIComponent(filePath)}`}
          >
            <Button icon={<DownloadOutlined />} />
          </a>
        ) : (
          'Chưa có file'
        );
      },
    },
  ];

  return documents.length > 0 ? (
    <Table dataSource={documents} columns={columns} rowKey="id" loading={loading} />
  ) : (
    <Empty description="Không có tài liệu thuộc danh mục này" />
  );
};

export default CategoryDetail;
