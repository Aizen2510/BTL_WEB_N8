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

// Lấy số lượng tài liệu trong danh mục
const getDocumentCount = (categoryId: string): number => {
    try {
        const rawData = localStorage.getItem('data') || '[]';
        const allDocs = JSON.parse(rawData);
        return allDocs.filter((doc: any) => doc.categoryId === categoryId).length;
    } catch (error) {
        console.error('Lỗi khi đếm số tài liệu:', error);
        return 0;
    }
};

export default function useCategoryModel() {
    const [categories, setCategoriesState] = useState<category.Record[]>([]);
    const [categoryVisible, setCategoryVisible] = useState(false);
    const [categoryIsEdit, setCategoryIsEdit] = useState(false);
    const [categoryRow, setCategoryRow] = useState<category.Record | undefined>();
    const [searchText, setSearchText] = useState('');
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<category.Record | null>(null);

    const getCategories = async () => {
        try {
            const response = await getCategory();
            if (response && Array.isArray(response.data)) {
                // Cập nhật documentCount cho mỗi danh mục
                const updatedCategories = response.data.map(category => ({
                    ...category,
                    documentCount: getDocumentCount(category.categoryId)
                }));
                setCategoriesState(updatedCategories);
                localStorage.setItem('categories', JSON.stringify(updatedCategories));
                return;
            }
            throw new Error('Dữ liệu trả về không hợp lệ');
        } catch (error) {
            console.warn('Lỗi API, fallback sang localStorage:', error);
            const localData = safeGetLocalData('categories') || [];
            // Cập nhật documentCount cho dữ liệu local
            const updatedLocalData = localData.map((category: category.Record) => ({
                ...category,
                documentCount: getDocumentCount(category.categoryId)
            }));
            setCategoriesState(updatedLocalData);
        }
    };

    // Lọc danh mục theo tên hoặc mô tả
    const filteredCategories = categories.filter((cat) =>
        [cat.categoryName, cat.description]
            .some((field) => field?.toLowerCase().includes(searchText.toLowerCase()))
    );

    const saveCategories = (newCategories: category.Record[]) => {
        // Cập nhật documentCount trước khi lưu
        const updatedCategories = newCategories.map(category => ({
            ...category,
            documentCount: getDocumentCount(category.categoryId)
        }));
        setCategoriesState(updatedCategories);
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
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
        searchText,
        setSearchText,
        filteredCategories,
    };
}
