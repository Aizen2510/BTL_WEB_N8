import { useState, useEffect } from 'react';
import { getCategory } from '@/services/documentCategory';

// Lấy dữ liệu localStorage an toàn
const safeGetLocalData = (key: string) => {
    try {
        const json = localStorage.getItem(key);
        if (!json) return null;
        const data = JSON.parse(json);
        if (Array.isArray(data)) return data;
        return null;
    } catch (error) {
        console.error('Lỗi parse localStorage:', error);
        return null;
    }
    };

    export default function useCategoryModel() {
    const [categories, setCategoriesState] = useState<category.Record[]>([]);
    const [categoryVisible, setCategoryVisible] = useState(false);
    const [categoryIsEdit, setCategoryIsEdit] = useState(false);
    const [categoryRow, setCategoryRow] = useState<category.Record | undefined>();

    const getCategories = async () => {
        try {
        const response = await getCategory();
        if (response && Array.isArray(response.data)) {
            setCategoriesState(response.data);
            localStorage.setItem('categories', JSON.stringify(response.data));
            return;
        }
        throw new Error('Dữ liệu trả về không hợp lệ');
        } catch (error) {
        console.warn('Lỗi API, fallback sang localStorage:', error);
        const localData = safeGetLocalData('categories') || [];
        setCategoriesState(localData);
        }
    };

    const saveCategories = (newCategories: category.Record[]) => {
        setCategoriesState(newCategories);
        localStorage.setItem('categories', JSON.stringify(newCategories));
    };

    useEffect(() => {
        getCategories();
    }, []);

    return {
        categories,
        setCategories: saveCategories,
        categoryVisible,
        setCategoryVisible,
        categoryIsEdit,
        setCategoryIsEdit,
        categoryRow,
        setCategoryRow,
        getCategories,
    };
}
