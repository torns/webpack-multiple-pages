const path = require('path')
const glob = require('glob')

const srcDir = path.resolve(__dirname, '../src')

/**
 * process 有毒，它的依赖被各个 lib 争夺...导致了各种各样奇葩的依赖问题
 * 其他被共享依赖也有可能导致类似问题，dll 使用要万分小心
 */
module.exports = Object.assign(
  {
    lib: {
      vue: ['vue'],
      utils: ['axios', 'md5'],
      lodash: ['lodash', 'lodash/fp'],
      antdMobile: ['antd-mobile'],
      mintUI: ['mint-ui'],
      /**
       * react-router 与 react-router-dom 异同：https://github.com/ReactTraining/react-router/issues/4648
       * 民间中文资料：http://blog.csdn.net/sinat_17775997/article/details/69218382
       */
      reactRouter: [
        'react-router',
        'react-router-dom',
        'history',
        'react-router-cache-route'
      ],
      mobx: ['mobx', 'mobx-react'],
      redux: [
        'redux',
        'redux-actions',
        'redux-thunk',
        'redux-promise',
        'react-redux',
        'redux-persist',
        'react-router-redux',
        're-modulex'
      ]
    },
    dll: {
      polyfill: [
        'babel-polyfill',
        /**
         * 使用 Viewport Units Buggyfill 插件来兼容 vw、vh、vmin、vmax 等 css 单位，参考：https://www.w3cplus.com/mobile/vw-layout-in-vue.html
         */
        'viewport-units-buggyfill',
        'viewport-units-buggyfill/viewport-units-buggyfill.hacks',
        '@cjy0208/fastclick',
        'amfe-flexible',
        /**
         * 异步模块的样式暂未抽离成单独的 css 文件，需要补齐 css-loader 和 style-loader 的必要脚本以生成 style 标签
         */
        './node_modules/style-loader/lib/addStyles.js',
        './node_modules/css-loader/lib/css-base.js'
      ],
      immutable: ['immutable'],
      helpers: ['dayjs'],
      react: [
        'react',
        'react-dom',
        'prop-types',
        'hoist-non-react-statics',
        'invariant'
      ],
      vueTools: [
        'vuex',
        'vue-router',
        './node_modules/vue-loader/lib/runtime/component-normalizer.js',
        './node_modules/vue-style-loader/lib/listToStyles.js',
        './node_modules/vue-style-loader/lib/addStylesClient.js'
      ]
    }
  },
  glob
    .sync(`${srcDir}/**/* @*`)
    .filter(filepath => {
      if (glob.sync(`${filepath}/index.js`).length === 0) {
        return false
        // throw new Error(`
        //   No entry point found in '${path
        //     .resolve(filepath)
        //     .replace(srcDir, 'src')}'
        // `)
      }

      return true
    })
    .reduce(
      (entries, filepath) => {
        const type = path
          .resolve(filepath)
          .replace(srcDir, '')
          .split(path.sep)[1]
        const [name, alias] = filepath
          .split('/')
          .pop()
          .split(' @')

        const projectName = alias || name

        if (projectName in entries[type]) {
          throw new Error(`
            Duplicated entry named '${projectName}' 
            Found in '${path.resolve(filepath).replace(srcDir, 'src')}' 
            Agains with '${path
              .resolve(entries[type][projectName])
              .replace(srcDir, 'src')}'
          `)
        }

        return Object.assign(entries, {
          [type]: Object.assign({}, entries[type], {
            [projectName]: filepath
          })
        })
      },
      {
        project: {},
        vendor: {}
      }
    ),
  {
    // 此处勿改动，仅作优化dev速度使用
    __dev: {
      __devTools: [
        './node_modules/sockjs-client/dist/sockjs.js',
        'html-entities',
        'events',
        'loglevel',
        'punycode',
        'querystring-es3',
        // 'react-hot-loader',
        'url',
        'ansi-html',
        './node_modules/fast-levenshtein/levenshtein.js',

        './node_modules/style-loader/lib/addStyles.js',
        './node_modules/antd-mobile/lib/index.js',
        './node_modules/rmc-calendar/lib/locale/en_US.js',
        './node_modules/antd-mobile/lib/style/index.js',
        './node_modules/antd-mobile/lib/switch/style/index.js',
        './node_modules/antd-mobile/lib/calendar/locale/en_US.js',
        './node_modules/antd-mobile/lib/calendar/style/index.js',
        './node_modules/antd-mobile/lib/icon/style/index.js',
        './node_modules/antd-mobile/lib/list/style/index.js',
        './node_modules/antd-mobile/lib/picker-view/style/index.js',
        './node_modules/antd-mobile/lib/picker/style/index.js',
        './node_modules/antd-mobile/lib/slider/style/index.js',
        './node_modules/antd-mobile/lib/white-space/style/index.js',
        './node_modules/antd-mobile/lib/wing-blank/style/index.js',
        './node_modules/antd-mobile/lib/date-picker/locale/en_US.js',
        './node_modules/antd-mobile/lib/date-picker/style/index.js',

        './node_modules/css-loader/lib/css-base.js',

        './node_modules/mint-ui/lib/picker/index.js',
        './node_modules/mint-ui/lib/popup/index.js',
        './node_modules/mint-ui/lib/datetime-picker/index.js',

        './node_modules/vue-hot-reload-api/dist/index.js',
        './node_modules/vue-loader/lib/runtime/component-normalizer.js',
        './node_modules/vue-style-loader/lib/addStylesClient.js',
        './node_modules/vue-style-loader/lib/listToStyles.js',
        './node_modules/webpack-dev-server/client/index.js'
      ]
    }
  }
)
