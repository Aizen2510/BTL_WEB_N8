import { message } from 'antd';
import { Document, Category } from '@/services/ThaoTacTaiLieu/typings';

export const STORAGE_KEYS = {
  DOCUMENTS: 'documents',
  CATEGORIES: 'categories',
  CURRENT_USER: 'current_user',
};

// Dữ liệu danh mục mặc định
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Tài liệu học tập' },
  { id: '2', name: 'Tài liệu nghiên cứu' },
  { id: '3', name: 'Tài liệu tham khảo' },
  { id: '4', name: 'Tài liệu chuyên ngành' },
  { id: '5', name: 'Tài liệu khác' }
];

// ----------------------------
// TÀI LIỆU (Document)
// ----------------------------

export const getDocuments = (): Document[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Lỗi khi lấy tài liệu:', error);
    return [];
  }
};

export const saveDocuments = (docs: Document[]): void => {
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
};

export const addDocument = (doc: Document): void => {
  const docs = getDocuments();
  docs.push(doc);
  saveDocuments(docs);
};

export const updateDocument = (doc: Document): void => {
  const docs = getDocuments();
  const index = docs.findIndex((d) => d.id === doc.id);
  if (index !== -1) {
    docs[index] = doc;
    saveDocuments(docs);
  }
};

export const deleteDocument = (docId: string): boolean => {
  try {
    const docs = getDocuments();
    const exist = docs.find((d) => d.id === docId);
    if (!exist) {
      message.error('Không tìm thấy tài liệu!');
      return false;
    }
    const updated = docs.filter((d) => d.id !== docId);
    saveDocuments(updated);
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa tài liệu:', error);
    message.error('Có lỗi xảy ra khi xóa tài liệu!');
    return false;
  }
};

export const getDocumentById = (docId: string): Document | undefined => {
  return getDocuments().find((doc) => doc.id === docId);
};

export const incrementDownloadCount = (docId: string): void => {
  const docs = getDocuments();
  const index = docs.findIndex((d) => d.id === docId);
  if (index !== -1) {
    docs[index].downloadCount += 1;
    saveDocuments(docs);
  }
};

// ----------------------------
// DANH MỤC (Category)
// ----------------------------

export const getCategories = (): Category[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!stored) {
      // Nếu chưa có dữ liệu, lưu dữ liệu mặc định
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Lỗi khi lấy danh mục:', error);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (cats: Category[]): void => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
};

export const addCategory = (cat: Category): void => {
  const cats = getCategories();
  cats.push(cat);
  saveCategories(cats);
};

export const updateCategory = (cat: Category): void => {
  const cats = getCategories();
  const index = cats.findIndex((c) => c.id === cat.id);
  if (index !== -1) {
    cats[index] = cat;
    saveCategories(cats);
  }
};

export const deleteCategory = (catId: string): boolean => {
  try {
    const cats = getCategories();
    const exists = cats.find((c) => c.id === catId);
    if (!exists) {
      message.error('Không tìm thấy danh mục!');
      return false;
    }
    const updated = cats.filter((c) => c.id !== catId);
    saveCategories(updated);
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa danh mục:', error);
    message.error('Có lỗi xảy ra khi xóa danh mục!');
    return false;
  }
};

export const getCategoryNameById = (catId: string): string => {
  const category = getCategories().find((c) => c.id === catId);
  return category ? category.name : 'Danh mục không tồn tại';
};

// ----------------------------
// USER đang đăng nhập (giả lập)
// ----------------------------

export const setCurrentUser = (username: string): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, username);
};

export const getCurrentUser = (): string => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'admin';
};

// Thêm export với tên getCurrentAdmin và setCurrentAdmin để tương thích với models
export const setCurrentAdmin = setCurrentUser;
export const getCurrentAdmin = getCurrentUser;
