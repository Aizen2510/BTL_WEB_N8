import { useState, useEffect } from 'react';
import { getDataReport } from '@/services/documentReport';

const LOCAL_KEY = 'reportDataCache';

const useDocumentReportState = () => {
    const [categoryStats, setCategoryStats] = useState<DocumentReport.CategoryStatistic[]>([]);
    const [uploaderStats, setUploaderStats] = useState<DocumentReport.UploaderStatistic[]>([]);
    const [fileTypeStats, setFileTypeStats] = useState<DocumentReport.FileTypeStatistic[]>([]);
    const [downloadStats, setDownloadStats] = useState<DocumentReport.DownloadStatistic | null>(null);
    const [chartCategory, setChartCategory] = useState<DocumentReport.ChartCategory[]>([]);
    const [chartTopDownload, setChartTopDownload] = useState<DocumentReport.ChartTopDownload[]>([]);
    const [exportFilter, setExportFilter] = useState<DocumentReport.ExportFilter>({});
    const [excelExportRows, setExcelExportRows] = useState<DocumentReport.ExcelExportRow[]>([]);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const res = await getDataReport();
                const data = res?.data || res; // fallback cho kiểu res.data hoặc res

                if (data) {
                    setCategoryStats(data.categoryStats || []);
                    setUploaderStats(data.uploaderStats || []);
                    setFileTypeStats(data.fileTypeStats || []);
                    setDownloadStats(data.downloadStats || null);
                    setChartCategory(data.chartCategory || []);
                    setChartTopDownload(data.chartTopDownload || []);
                    setExcelExportRows(data.excelExportRows || []);

                    // Lưu vào localStorage (đã làm trong getDataReport rồi nếu thành công)
                }
            } catch (error) {
                console.error('Lỗi lấy dữ liệu thống kê:', error);

                // Fallback: từ localStorage nếu có
                const cached = localStorage.getItem(LOCAL_KEY);
                if (cached) {
                    const localData = JSON.parse(cached);
                    setCategoryStats(localData.categoryStats || []);
                    setUploaderStats(localData.uploaderStats || []);
                    setFileTypeStats(localData.fileTypeStats || []);
                    setDownloadStats(localData.downloadStats || null);
                    setChartCategory(localData.chartCategory || []);
                    setChartTopDownload(localData.chartTopDownload || []);
                    setExcelExportRows(localData.excelExportRows || []);
                }
            }
        };

        fetchReportData();
    }, []);

    return {
        categoryStats, setCategoryStats,
        uploaderStats, setUploaderStats,
        fileTypeStats, setFileTypeStats,
        downloadStats, setDownloadStats,
        chartCategory, setChartCategory,
        chartTopDownload, setChartTopDownload,
        exportFilter, setExportFilter,
        excelExportRows, setExcelExportRows,
    };
};

export default useDocumentReportState;
