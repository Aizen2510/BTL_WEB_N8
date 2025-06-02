import { useState } from 'react';
import type { Document, Category } from '@/services/ThaoTacTaiLieu/typings';
import {
  getDocuments,
  getCategories,
  deleteDocument,
  deleteCategory,
  addDocument,
  addCategory,
  updateDocument,
  updateCategory,
  getCurrentAdmin,
  setCurrentAdmin,
} from '@/services/ThaoTacTaiLieu/index';
import { message } from 'antd';

const useDocumentsModel = () => {
  // Trạng thái loading và hiển thị modal
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [isDetail, setIsDetail] = useState<boolean>(false);

  // Dữ liệu tài liệu
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  // Dữ liệu danh mục
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  // Dữ liệu admin
  const [currentAdminName, setCurrentAdminName] = useState<string>(getCurrentAdmin());

  // Tải dữ liệu tài liệu từ localStorage
  const fetchDocuments = () => {
    setLoading(true);
    try {
      const docs = getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Lỗi khi tải tài liệu:', error);
      message.error('Không thể tải danh sách tài liệu');
    } finally {
      setLoading(false);
    }
  };

  // Tải dữ liệu danh mục từ localStorage
  const fetchCategories = () => {
    try {
      const cats = getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
      message.error('Không thể tải danh mục');
    }
  };

  // Lọc tài liệu theo từ khóa tìm kiếm và danh mục
  const getFilteredDocuments = (): Document[] => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchText.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategoryId ? doc.category === selectedCategoryId : true;
      return matchesSearch && matchesCategory;
    });
  };

  return {
    // States
    isLoading,
    setLoading,
    isModalVisible,
    setIsModalVisible,
    isEdit,
    setEdit,
    isDetail,
    setIsDetail,

    documents,
    setDocuments,
    selectedDocument,
    setSelectedDocument,
    searchText,
    setSearchText,

    categories,
    setCategories,
    selectedCategoryId,
    setSelectedCategoryId,

    currentAdminName,
    setCurrentAdminName,

    // Actions
    fetchDocuments,
    fetchCategories,
    getFilteredDocuments,

    // LocalStorage service actions (dùng thẳng nếu cần)
    addDocument,
    updateDocument,
    deleteDocument,

    addCategory,
    updateCategory,
    deleteCategory,

    setCurrentAdmin, // lưu vào localStorage
  };
};

export default useDocumentsModel;