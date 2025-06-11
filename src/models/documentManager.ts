import { useState } from 'react';
import {
  getAllDocuments,

  updateDocument,
  deleteDocument,
  createAdminDocument,
} from '@/services/documentService';

export default () => {
  const [data, setDataState] = useState<Document.Record[]>([]);
  const [visible, setVisible] = useState(false);
  const [row, setRow] = useState<Document.Record>();
  const [isEdit, setIsEdit] = useState(false);
  const [searchText, setSearchText] = useState('');

  const getDoc = async () => {
    const res = await getAllDocuments();
    setDataState(res.data);
  };

  const setData = async (doc: Document.Record, editMode: boolean) => {
    if (editMode) {
      const updatedResponse = await updateDocument(doc.id, doc);
      const updated = updatedResponse.data || updatedResponse;
      setDataState(prev => prev.map(item => (item.id === doc.id ? updated : item)));
    } else {
      // ✅ Sử dụng API dành cho admin
      const createdResponse = await createAdminDocument(doc);
      const created = createdResponse.data || createdResponse;
      setDataState(prev => [...prev, created]);
    }
  };

  const removeDocument = async (id: string) => {
    await deleteDocument(id);
    setDataState(prev => prev.filter(item => item.id !== id));
  };

  const filteredData = data.filter((item) =>
    [item.title, item.uploaderName, item.description]
      .join(' ')
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return {
    data,
    setData,
    visible,
    setVisible,
    row,
    setRow,
    isEdit,
    setIsEdit,
    getDoc,
    removeDocument,
    searchText,
    setSearchText,
    filteredData,
  };
};
