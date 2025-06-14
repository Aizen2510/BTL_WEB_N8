import type { EVaiTroKhaoSat } from '@/services/TienIch/constant';
import type { ENotificationSource, ESourceTypeNotification } from './constant';
import { type EReceiverType } from './constant';

declare module ThongBao {
	export interface IRecord {
		_id: string;
		title: string;
		senderName: string;
		sender?: string;
		description?: string;
		type?: string;
		content?: string;
		imageUrl?: string;
		idTagEmail?: string;

		tagEmail: {
			_id: '65582e549dcae9f3309e415e';
			ten: 'Thông báo trúng tuyển';
			moTa: 'Đây là thông báo trúng tuyển';
			__v: 0;
		};
		filter?: {
			roles: EVaiTroKhaoSat[];
			idKhoaSinhVien: string;
			idKhoa: string;
			idNganh: string;
			idLopHanhChinh: string;
			idLopTinChi: string;
		};
		receiverType: EReceiverType;
		users?: string[];

		createdAt: string; // '2023-06-27T07:47:29.693Z';
		read: boolean;

		sourceType?: ESourceTypeNotification;
		targetType?: ESourceTypeNotification;
		notificationInternal: boolean;
		thoiGianHieuLuc: Date;
		taiLieuDinhKem: string[];

		metadata?: TNotificationSource;

		userList: IUser[];

		oneSignalData?: string | null;
		urlFile?: string[] | null;
	}

	export interface IThongKe {
		tatCa: 20;
		theoKhoaSinhVien: 4;
		theoLopHanhChinh: 5;
		theoLopHocPhan: 1823;
		theoNganh: 2;
		theoNguoiDung: 25;
		theoTopic: 0;
		theoKhoa: 2;
	}

	export interface IThongKeNguoiNhan {
		chuaDoc: 54;
		daDoc: 1;
	}

	export interface IUser {
		ssoId: string;
		code: string;
		// firstname: string;
		// lastname: string;
		fullname: string;
		username: string;
		email: string;
		email365: string;
		maKhoaSinhVien: string;
		maNganh: string;
		vaiTro?: EVaiTroKhaoSat;
		tenLopHanhChinh?: string;
		trangThaiSinhVien?: string;
		tenKhoaSinhVien?: string;
		tenNganh?: string;

		danToc?: string;
		maDonVi?: string;
		tenDonVi?: string;
		idDonVi?: string;
		trangThaiLamViec?: string;
		gioiTinh?: string;

		trangThaiHoc?: string; //Lấy Enum từ các phân hệ
		trangThai?: string; //Lấy Enum từ các phân hệ
	}

	export type TReceiver = {
		ssoId: string;
		username: string;
		fullname: string;
		read?: boolean;
	};

	export type TNotificationSource = {
		entityId?: string;
		entitySource?: ENotificationSource;
		pathWeb?: string;
		phanHe?: ESourceTypeNotification;
	} & Record<string, any>;
}

export function notifyAdmin({ type, title, content }) {
	const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
	adminNotifications.push({
		id: Date.now() + Math.random(),
		type,
		title,
		content,
		createdAt: new Date().toISOString(),
		read: false,
	});
	localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
}

export function notifyUser({ type, title, content, userId }) {
	const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
	userNotifications.push({
		id: Date.now() + Math.random(),
		type,
		title,
		content,
		createdAt: new Date().toISOString(),
		read: false,
		userId,
	});
	localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
}

export function notifyAllUsers({ type, title, content }) {
	const users = JSON.parse(localStorage.getItem('users') || '[]');
	const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
	users.forEach((u) => {
		userNotifications.push({
			id: Date.now() + Math.random(),
			type,
			title,
			content,
			createdAt: new Date().toISOString(),
			read: false,
			userId: u.id,
		});
	});
	localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
}

export function getAdminNotifications() {
	return JSON.parse(localStorage.getItem('adminNotifications') || '[]');
}

export function getUserNotifications(currentUserId) {
	const all = JSON.parse(localStorage.getItem('userNotifications') || '[]');
	return all.filter(n => n.userId === currentUserId);
}
