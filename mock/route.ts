export default {
  devServer: {
    open: '/home', // Trình duyệt sẽ mở http://localhost:8000/admin
  },
  '/api/auth_routes': {
    '/form/advanced-form': { authority: ['admin', 'user'] },
  },
};
