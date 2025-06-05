import { useState, useEffect, useRef } from 'react';
import { getDocuments, getCategories } from '@/services/ThaoTacTaiLieu/index';
import type { Document, Category } from '@/services/ThaoTacTaiLieu/typings';

export default function useTaiLieuModel() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const prevDocumentsRef = useRef<any[]>([]);

  useEffect(() => {
    const docs: Document[] = getDocuments();
    const cats: Category[] = getCategories();
    setCategories(cats.map(c => c.name));
    const types = Array.from(new Set(docs.map(d => d.fileType && d.fileType.toUpperCase ? d.fileType.toUpperCase() : 'Khác')));
    setDocumentTypes(types.length ? types : ['PDF', 'DOCX', 'PPTX', 'XLSX', 'Khác']);
    setDocuments(
      docs
        .filter(doc => doc.status === 'approved')
        .map(doc => ({
          id: doc.id,
          title: doc.title,
          category: cats.find(c => c.id === doc.category)?.name || doc.category,
          subcategory: '',
          type: doc.fileType && doc.fileType.toUpperCase ? doc.fileType.toUpperCase() : 'Khác',
          size: doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(1)} MB` : '',
          uploadedBy: doc.uploadedBy,
          uploadDate: doc.uploadDate,
          downloads: doc.downloadCount,
          status: doc.status === 'approved' ? 'Đã duyệt' : doc.status === 'pending' ? 'Chờ duyệt' : 'Đã từ chối',
          description: doc.description,
          fileUrl: doc.fileUrl,
        }))
    );
  }, []);

  function diffDocuments(prev: any[], curr: any[]) {
    const changes: any[] = [];
    const prevMap = new Map(prev.map(doc => [doc.id, doc]));
    const currMap = new Map(curr.map(doc => [doc.id, doc]));
    curr.forEach(doc => {
      if (!prevMap.has(doc.id)) {
        changes.push({ id: doc.id, type: 'add', title: doc.title, date: doc.uploadDate });
      }
    });
    prev.forEach(doc => {
      if (!currMap.has(doc.id)) {
        changes.push({ id: doc.id, type: 'delete', title: doc.title, date: doc.uploadDate });
      }
    });
    curr.forEach(doc => {
      const prevDoc = prevMap.get(doc.id);
      if (prevDoc && JSON.stringify(doc) !== JSON.stringify(prevDoc)) {
        changes.push({ id: doc.id, type: 'edit', title: doc.title, date: doc.uploadDate });
      }
    });
    return changes;
  }

  useEffect(() => {
    const prevDocs = prevDocumentsRef.current;
    const changes = diffDocuments(prevDocs, documents);
    if (changes.length > 0) {
      setNotifications(prev => {
        const merged = [...changes.reverse(), ...prev].slice(0, 6);
        const unique = [];
        const seen = new Set();
        for (const n of merged) {
          const key = n.id + n.type + n.date;
          if (!seen.has(key)) {
            unique.push(n);
            seen.add(key);
          }
        }
        return unique.slice(0, 6);
      });
    }
    prevDocumentsRef.current = documents;
  }, [documents]);

  return {
    documents,
    setDocuments,
    loading,
    setLoading,
    searchText,
    setSearchText,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    previewVisible,
    setPreviewVisible,
    previewDocument,
    setPreviewDocument,
    categories,
    setCategories,
    documentTypes,
    setDocumentTypes,
    showNotifications,
    setShowNotifications,
    notifications,
    setNotifications,
  };
}
