import { useState, useCallback } from 'react';
import {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/documentCate';
import { message } from 'antd';

export default () => {
  const [categories, setCategories] = useState<category.Record[]>([]);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [categoryIsEdit, setCategoryIsEdit] = useState(false);
  const [categoryRow, setCategoryRow] = useState<category.Record | undefined>(undefined);
  const [searchText, setSearchText] = useState('');

  const getCategories = useCallback(async () => {
    try {
      const res = await getCategory();
    console.log('API categories:', res.data); // Thêm dòng này
      setCategories(res.data || []);
    } catch (error) {
      message.error('Lỗi khi tải danh mục');
    }
  }, []);

  const addCategory = async (data: Partial<category.Record>) => {
    try {
      await createCategory(data);
      message.success('Thêm danh mục thành công');
      await getCategories();
    } catch {
      message.error('Thêm danh mục thất bại');
    }
  };

  const editCategory = async (id: string, data: Partial<category.Record>) => {
    try {
      await updateCategory(id, data);
      message.success('Cập nhật danh mục thành công');
      await getCategories();
    } catch {
      message.error('Cập nhật thất bại');
    }
  };

  const removeCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      message.success('Xoá danh mục thành công');
      await getCategories();
    } catch {
      message.error('Xoá thất bại');
    }
  };

  const filteredCategories = categories.filter((item) =>
    item.categoryName.toLowerCase().includes(searchText.toLowerCase())
  );

  return {
    categories,
    setCategories,
    categoryVisible,
    setCategoryVisible,
    categoryIsEdit,
    setCategoryIsEdit,
    categoryRow,
    setCategoryRow,
    searchText,
    setSearchText,
    filteredCategories,
    getCategories,
    addCategory,
    editCategory,
    removeCategory,
  };
};
