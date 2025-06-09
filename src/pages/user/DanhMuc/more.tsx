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

  // Hàm cập nhật lượt tải xuống
  const handleDownload = (id: number) => {
    try {
      // Cập nhật lượt tải trong localStorage
      const rawData = localStorage.getItem('data') || '[]';
      const allDocs = JSON.parse(rawData);
      const updatedDocs = allDocs.map((d: any) => {
        if (d.id === id) {
          return {
            ...d,
            downloads: (d.downloads || 0) + 1,
            downloadCount: (d.downloadCount || 0) + 1,
          };
        }
        return d;
      });
      localStorage.setItem('data', JSON.stringify(updatedDocs));

      // Cập nhật state
      setDocuments((prevDocs: any[]) =>
        prevDocs.map((d) =>
          d.id === id
            ? {
                ...d,
                downloads: (d.downloads || 0) + 1,
                downloadCount: (d.downloadCount || 0) + 1,
              }
            : d
        )
      );
    } catch (error) {
      console.error('Lỗi khi tải xuống:', error);
    }
  };

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
      title: 'File',
      dataIndex: 'fileUrl',
      key: 'fileUrl',
      align: 'center',
      width: 120,
      render: (text, record) => {
        const filePath = record.fileUrl
          ? record.fileUrl.replace('http://localhost:3000/uploads/', '')
          : '';
        return record.fileUrl ? (
          <a
            href={`http://localhost:3000/download/${encodeURIComponent(filePath)}`}
            onClick={() => handleDownload(Number(record.id))}
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
