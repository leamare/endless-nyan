'use strict';

let config  = require('./config.json');

const __BUILDID__ = (+new Date).toString(36),
      __VERSION__ = '1.1.0',
      __NYANSRV__ = config.srv;

var src   = './src/',
    build = './build/';

var modRewrite  = require('connect-modrewrite');

var getEnvPostfix = () => global.production ? "min." : "";

var vendorList = [
];


module.exports = {
  clean: {
    src: [build+'**/*', '!'+build+'app/**']
  },

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  styles: {
    src: [
      src + 'css/*.css',
      src + 'assets/**/*.css',
    ],
    dest: build,
    name: 'bundle.min.css',
    cssnano: {
      zindex: false
    }
  },

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  createVendorList: () => vendorList.map((currVal, index, array) => {
    return currVal.replace('%PF.', getEnvPostfix());
  }),

  vendor: {
    src: [
      './node_modules/howler/dist/howler.core.min.js'
    ],
    dest: build,
    name: 'vendor.js'
  },

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  scripts: {
    src: [
      src + 'js/**/**/*.js',
      src + 'js/**/*.js',
      src + 'js/*.js',
    ],
    dest: build,
    name: 'bundle.js',
    buildConfig: {
      buildId: __BUILDID__,
      nyansrv: __NYANSRV__,
      version: __VERSION__
    },
  },

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  templates: {
    src: [
      src + 'templ/*.html'
    ],
    dest: build + 'templates/',

    // HTMLMinifier
    // See: https://github.com/kangax/html-minifier
    htmlmin: {
      collapseWhitespace: true
    }
  },

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  images: [
    {
      src: [
        src + 'assets/**/*.{png,jpg,svg}',
      ],
      dest: build + 'assets/'
    }
  ],

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  copy: [
    // root dir
    {
      src: [
        src + '*.*',
        src + '.*',
      ],
      dest: build
    },
    {
      src: [
        src + 'assets/**/*.{gif,mp3}',
      ],
      binary: true,
      dest: build + 'assets/'
    },
  ],

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  revision: {
    assets: {
      src: [
        build + '*.min.css',
        build + '*.min.js'
      ],
      base: build,
      dest: build,
      manifest: {path: 'rev-manifest.json'}
    },
    rename: {
      src: build + '/*.html',
      dest: build,
      manifestSrc: build + 'rev-manifest.json',
    }
  },

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  watch: {
    // BrowserSync. See more: https://www.browsersync.io/docs/options/
    browserSync: {
      // notify: true, // browser notification box (default: true)
      open: false, // open browser after start (default: true)
      // proxy: 'domain.ru' // wrap for real website (default: undefined)
      server: {
        baseDir: build,
        // middleware: [
        //     modRewrite([
        //         '!\\.\\w+$ /index.html [L]'
        //     ])
        // ]
      },
    },

    // Watch this directories
    src: {
      styles: [
        src + 'css/*.css',
        src + 'assets/**/*.css',
      ],
      scripts: [
        src + 'js/**/**/*.js',
        src + 'js/**/*.js',
        src + 'js/*.js',
      ],
      templates: [
        src + 'templ/*.html',
      ],
      images: src + [
        src + 'res/**/*.{png,jpg,svg}',
      ],
      copy: [
        src + 'index.html',
        src + '*.*',
        src + '.*',
        src + 'assets/**/*.{gif,mp3}',
      ],
    }
  }
};
