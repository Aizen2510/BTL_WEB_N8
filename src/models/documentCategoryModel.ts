import { useState } from 'react';

const SAMPLE_DATA = [
    {
        id: '1',
        name: 'Cấu Trúc Dữ Liệu',
        description: 'Tài liệu về cấu trúc dữ liệu cơ bản',
        documentCount: 5,
    },
];

const safeGetLocalData = (key: string) => {
    try {
        const json = localStorage.getItem(key);
        if (!json) return null;
        const data = JSON.parse(json);
        if (Array.isArray(data)) return data;
        return null;
    } catch (error) {
        console.error('Lỗi parse JSON localStorage:', error);
        return null;
    }
};

export default () => {
    const [categories, setCategories] = useState<Category.Record[]>([]); 
    const [categoryVisible, setCategoryVisible] = useState<boolean>(false);
    const [categoryIsEdit, setCategoryIsEdit] = useState<boolean>(false);
    const [categoryRow, setCategoryRow] = useState<Category.Record | undefined>();

    // Load dữ liệu từ localStorage
    const getCategories = () => {
        let dataLocal = safeGetLocalData('categories');
        if (!dataLocal) {
        localStorage.setItem('categories', JSON.stringify(SAMPLE_DATA));
        dataLocal = SAMPLE_DATA;
        }
        setCategories(dataLocal);
    };

    // Hàm cập nhật categories và lưu localStorage
    const saveCategories = (newCategories: Category.Record[]) => {
        setCategories(newCategories);
        localStorage.setItem('categories', JSON.stringify(newCategories));
    };

    return {
        categories,
        setCategories: saveCategories, // Thay setter mặc định thành hàm lưu localStorage
        categoryVisible,
        setCategoryVisible,
        categoryIsEdit,
        setCategoryIsEdit,
        categoryRow,
        setCategoryRow,
        getCategories,
    };
};
