export default [
  {
    path:'/webview',
    routes: [
      {path: '/webview', redirect: '/webview/tinylink' },
      {path: '/webview/tinylink', component: './Webview/Tinylink'},
    ],

  },
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      { path: '/', redirect: '/list/card-list' },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
        ],
      },
      
      {
        component: '404',
      },
    ],
  },
];
