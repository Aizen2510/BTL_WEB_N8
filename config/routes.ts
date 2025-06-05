import { layout } from "@/app";
import component from "@/locales/en-US/component";
import path from "path";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/home',
				name: 'Trang chủ',
				component: './user/Home',
				layout: false,
			},
			{
				path: '/user/tailieu',
				name: 'Tài liệu',
				layout: false,
				component: './user/TaiLieu',
			},
			{
				path: '/user/thongke',
				name: 'Thống kê',
				component: './user/ThongKe',
				layout: false,
			},
			{
				path: '/user/thaotactailieu',
				name: 'Thao tác tài liệu',
				component: './user/ThaoTacTaiLieu',
				layout: false,
			},
			{
				path: '/user/usermanagement',
				name: 'Quản Lý Người Dùng',
				component: './user/QuanLiNguoiDung',
				icon: 'UserOutlined',
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

	/*{
		path: '/themtailieu',
		name: 'Đăng Tải Tài Liệu',
		component: './ThemTaiLieu',
		icon: 'FileAddOutlined',
	},
	{
		path: '/duyettailieu',
		name: 'Duyệt Tài Liệu',
		component: './DuyetTaiLieu',
		icon: 'CheckCircleOutlined',
	},
	{
		path: '/thaotactailieu',
		name: 'Thao Tác Tài Liệu',
		component: './ThaoTacTaiLieu',
		icon: 'FileProtectOutlined',
	},*/
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