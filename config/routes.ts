import { layout } from "@/app";
import component from "@/locales/en-US/component";
import path from "path";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{

			},
		],
	},

	// aut
	{
		path: '/login',
		component: './Login',
		layout: false
	},
		{
		path: '/register',
		component: './Register',
		layout: false
	},
	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		component: './TrangChu',
	},
	{
		path: '/admin',
		

		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/documentmanaget',
		name: 'Quản Lí Tài Liệu',
		component: './QuanLiTaiLieu',
		icon: 'FormOutlined',
	},
	{
		path: '/category',
		name: 'Danh Mục',
		component: './DanhMucTaiLieu',
		icon: 'PicRightOutlined',
	},
	{
		path: '/report',
		name: 'Báo Cáo Thống Kê',
		component: './DocumentReport',
		icon: 'BarChartOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
