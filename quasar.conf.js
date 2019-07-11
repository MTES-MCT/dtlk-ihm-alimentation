// Configuration for your app

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'sleep', 'navigationguards', 'axios', 'env'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons',
      // 'ionicons',
      'mdi'
      // 'fontawesome'
    ],
    supportIE: false,
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      env: require('./config/envparser')(),
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      publicPath: '/',
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })
      }
    },
    devServer: {
      // https: true,
      port: 80,
      open: false, // opens browser window automatically
      watchOptions: {
        poll: true,
        ignored: /node_modules/,
        'info-verbosity': 'verbose'
      }
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QPageContainer',
        'QPage',
        'QCard',
        'QCardMedia',
        'QCardTitle',
        'QCardSeparator',
        'QCardMain',
        'QCardActions',
        'QStepper',
        'QStep',
        'QField',
        'QInput',
        'QSelect',
        'QDatetime',
        'QAutocomplete',
        'QBtn',
        'QInnerLoading',
        'QSpinnerGears',
        'QList',
        'QListHeader',
        'QItemSeparator',
        'QItem',
        'QItemSide',
        'QItemMain',
        'QItemTile',
        'QPopover',
        'QChip',
        'QSpinnerDots',
        'QSpinnerHourglass',
        'QCollapsible',
        'QModal',
        'QModalLayout',
        'QToolbar',
        'QToolbarTitle',
        'QIcon',
        'QProgress',
        'QUploader',
        'QAlert',
        'QTree'
      ],
      directives: [
        'Ripple'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'SessionStorage',
        'Loading',
        'Dialog'
      ],
      iconSet: 'mdi',
      i18n: 'fr'
    },
    // animations: 'all' --- includes all animations
    animations: [
      'bounceInLeft',
      'bounceOutRight',
      'wobble'
    ],
    pwa: {
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack (cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.2'
  }
}
