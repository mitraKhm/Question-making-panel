/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli/quasar-conf-js

/* eslint-env node */
const ESLintPlugin = require('eslint-webpack-plugin')
const { configure } = require('quasar/wrappers')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const path = require('path')

module.exports = configure(function (ctx) {
  return {
    // https://v2.quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://v2.quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli/boot-files
    boot: [
      'i18n',
      'axios',
      'appConfig',
      'middleware',
      'icon',
      'breadcrumbs',
      'routesLayoutConfigs'
    ],

    // https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.scss'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      'mdi-v6',
      // 'mdi-v5',
      // 'fontawesome-v5',
      // 'ionicons-v4',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: 'history', // available values: 'hash', 'history'
      productName: 'سوالا',
      // transpile: false,
      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      rtl: true, // https://v2.quasar.dev/options/rtl-support
      preloadChunks: false,
      showProgress: true,
      gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      distDir: 'dist',
      env: require('dotenv').config().parsed,

      // https://v2.quasar.dev/quasar-cli/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpack (chain) {
        const hashh = '[id].[name].[chunkhash]'
        chain.output.filename('js/[name]/' + hashh + '.bundle.js')
        chain.output.chunkFilename('js/[name]/' + hashh + '.chunk.js')
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: ['js', 'vue'] }])
        chain.module.rule('fonts')
          .use('url-loader')
          .tap((options) => {
            options.name = 'fonts/[path][name].[ext]'
            return options
          })

        // chain.module.rule('css')
        //   .test(/\.css$/)
        //   .use('mini-css-extract-plugin')
        //   .options({
        //     ignoreOrder: true
        //   })

        // chain.plugin('friendly-errors').tap(args => {
        //   // the actual transformer defined by vue-cli-3
        //   const vueCli3Transformer = args[0].additionalTransformers[0]
        //   args[0].additionalTransformers = [
        //     // use the actual transformer
        //     vueCli3Transformer,
        //     // add an other transformer that 'empty' the desired error
        //     error => {
        //       const regexp = /\[mini-css-extract-plugin\]\nConflicting order between:/
        //       if (regexp.test(error.message)) return {}
        //       return error
        //     }
        //   ]
        //   return args
        // })
      },
      extendWebpack (cfg, { isServer, isClient }) {
        cfg.resolve.alias = {
          ...cfg.resolve.alias, // This adds the existing alias

          // This will make sure that the hosting test app is pointing to only one instance of vue.
          vue: path.resolve('./node_modules/vue')
        }

        cfg.watchOptions = {
          aggregateTimeout: 200,
          poll: 1000
        }

        cfg.plugins.push(new CopyWebpackPlugin({
          patterns: [
            {
              // from: './src-pwa/firebase-messaging-sw.js',
              from: path.resolve('./src-pwa/firebase-messaging-sw.js'),
              to: path.resolve('./dist/pwa/firebase-messaging-sw.js')
            }
          ]
        }))
        // cfg.plugins.push(new MiniCssExtractPlugin({
        //   ignoreOrder: true
        // }))
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    sourceFiles: {
      pwaRegisterServiceWorker: './src-pwa/register-service-worker.js',
      pwaServiceWorker: './src-pwa/firebase-messaging-sw.js'
      // pwaManifestFile?: string;
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      port: process.env.NGINX_PORT,
      open: true, // opens browser window automatically
      proxy: {
        [process.env.AUTH_API]: {
          target: process.env.AUTH_API_SERVER,
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            ['^' + process.env.AUTH_API]: ''
          }
        },
        [process.env.AAA_API]: {
          target: process.env.AAA_API_SERVER,
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            ['^' + process.env.AAA_API]: ''
          }
        },
        [process.env.TREE_API]: {
          target: process.env.TREE_API_SERVER,
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            ['^' + process.env.TREE_API]: ''
          }
        },
        [process.env.TAG_API]: {
          target: process.env.TAG_API_SERVER,
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            ['^' + process.env.TAG_API]: ''
          }
        },
        '/cdn': {
          target: 'https://cdn.alaatv.com',
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            '^/cdn': ''
          }
        }
      }
    },
    // https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      config: {
        notify: {
          timeout: 5000,
          position: 'top',
          // multiLine: true,
          classes: 'default-notify-class'
        }
      },

      iconSet: 'material-icons', // Quasar icon set
      lang: 'fa', // Quasar language pack (en-US)

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [
        'Notify',
        'Loading',
        'Dialog'
      ]
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: 'all',

    // https://v2.quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: true,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      maxAge: 1000 * 60 * 60 * 24 * 30,
      // Tell browser when a file from the server should expire from cache (in ms)

      chainWebpackWebserver (chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: ['js'] }])
      },

      middlewares: [
        ctx.prod ? 'compression' : '',
        'render' // keep this as last one
      ]
    },

    // https://v2.quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW

      // https://quasar.dev/quasar-cli-webpack/developing-pwa/configuring-pwa#reload-and-update-automatically
      skipWaiting: true,
      clientsClaim: true,

      // for the custom service worker ONLY (/src-pwa/custom-service-worker.[js|ts])
      // if using workbox in InjectManifest mode
      chainWebpackCustomSW (chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: ['js'] }])
      },

      manifest: {
        name: 'آزمون آنلاین آلاء',
        short_name: 'سه آ',
        background_color: '#FFFFFF',
        theme_color: '#ffc107',
        description: 'آزمون آنلاین آلاء',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: '3a'
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpackMain (chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: ['js'] }])
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpackPreload (chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: ['js'] }])
      }
    }
  }
})
