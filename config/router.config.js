export default [
  {
    path: '/webview',
    component: '../layouts/webviewLayout',
    routes: [
      { path: '/webview', redirect: '/webview/tinylink/localcompile' },
      {
        path: '/webview/tinylink',
        icon: 'dashboard',
        name: 'tinylink',
        routes: [
          {
            path: '/webview/tinylink/localcompile',
            name: 'localcomp',
            component: './TinyLink/localcompile',
          },
          {
            path: '/webview/tinylink/udccompile',
            name: 'udccomp',
            component: './TinyLink/udccompile',
          },
        ],
      },
      {
        path: '/webview/tinysim',
        icon: 'dashboard',
        name: 'tinysim',
        component: './TinySim/tinysim',
      },
      {
        path: '/webview/onelink',
        icon: 'dashboard',
        name: 'onelink',
        component: './OneLink/onelink',
      },
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
