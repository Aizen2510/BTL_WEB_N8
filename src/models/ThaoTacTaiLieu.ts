import { useState } from 'react';
import type { Document, Category } from '@/services/ThaoTacTaiLieu/typings';
import {
  getDocumentsAPI,
  getCategoriesAPI
} from '@/services/ThaoTacTaiLieu/index';
import { message } from 'antd';

// Dummy implementation of getCurrentAdmin, replace with actual logic or import if available
function getCurrentAdmin(): string {
  // For example, fetch from localStorage or return a default value
  return localStorage.getItem('adminName') || '';
}

const useDocumentsModel = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [isDetail, setIsDetail] = useState<boolean>(false);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const [currentAdminName, setCurrentAdminName] = useState<string>(getCurrentAdmin());

  // Tải dữ liệu tài liệu từ backend
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const docs = await getDocumentsAPI();
      setDocuments(docs);
    } catch (error) {
      console.error('Lỗi khi tải tài liệu:', error);
      message.error('Không thể tải danh sách tài liệu');
    } finally {
      setLoading(false);
    }
  };

  // Tải dữ liệu danh mục từ backend
  const fetchCategories = async () => {
    try {
      const cats = await getCategoriesAPI();
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
      const matchesCategory = selectedCategoryId ? doc.categoryId === selectedCategoryId : true;
      return matchesSearch && matchesCategory;
    });
  };

  return {
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

    fetchDocuments,
    fetchCategories,
    getFilteredDocuments,
  };
};

export default useDocumentsModel;
