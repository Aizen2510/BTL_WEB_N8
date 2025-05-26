import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  borderRadiusBase: string;
  siderWidth: number;
} = {
  navTheme: 'light',
  layout: 'mix', // hoặc 'top' / 'side'
  fixedHeader: true, // ✅ Header phải fixed để hiển thị avatar cố định
  headerTheme: 'light',
  siderWidth: 220,
  title: 'HỆ THỐNG QUẢN LÍ TÀI LIỆU',
  logo: '/logo.png',
  borderRadiusBase: '2px',
  contentWidth: 'Fluid',
  pwa: false,
  primaryColor: process.env.APP_CONFIG_PRIMARY_COLOR,
  fixSiderbar: true,
  colorWeak: false,
  headerHeight: 60,
  iconfontUrl: '',
};

export default Settings;
