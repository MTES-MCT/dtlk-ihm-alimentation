
export default [
  {
    path: '/public',
    component: () => import('layouts/NotAuthentified'),
    children: [
      { path: 'login', name: 'login', component: () => import('pages/Login') },
      { path: 'askaccount', name: 'askaccount', component: () => import('pages/AskAccount') },
      { path: 'forgottenpassword', name: 'forgottenpassword', component: () => import('pages/ForgottenPassword') },
      { path: 'logout', name: 'logout' }
    ]
  },
  {
    path: '/mypanel',
    component: () => import('layouts/MyPanel'),
    children: [
      { path: '', name: 'mypanel', component: () => import('pages/MyPanel') },
      { path: 'datasets', name: 'myorgdatasets', component: () => import('pages/MyOrgDatasets') },
      { path: 'jobs', name: 'myjobs', component: () => import('pages/MyJobs') },
      { path: 'alerts', name: 'myalerts', component: () => import('pages/MyAlerts') },
      { path: 'messages', name: 'mymessages', component: () => import('pages/MyMessages') },
      { path: 'account', name: 'myaccount', component: () => import('pages/MyAccount') }
    ]
  },
  {
    path: '/explore',
    component: () => import('layouts/MyPanel'),
    children: [
      { path: '', name: 'explore', component: () => import('pages/Explore') }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
