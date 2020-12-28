const mix = require('laravel-mix');
require('laravel-mix-workbox');
// require('laravel-mix-bundle-analyzer');

mix.setPublicPath('public')
    .js('resources/js/app.js', 'js/app.js')
    .sass('resources/sass/app.scss', 'css/app.css')
    .options({
        processCssUrls: false
    })
    .webpackConfig({
        output: {
            publicPath: ''
        }
    })

if (mix.inProduction()) {
    // mix.bundleAnalyzer({
    //     analyzerHost: '0.0.0.0',
    //     analyzerPort: 3000
    // })
    mix.version()
} else {
    mix.sourceMaps()
        .webpackConfig({
            devtool: 'source-map'
        })
}

mix.generateSW({
    runtimeCaching: [
        {
            urlPattern: (context) => context.url.pathname.includes('/readonly/'),
            handler: 'CacheFirst',
            options: {
                cacheName: 'readonly',
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        },
        {
            urlPattern: (context) => !context.url.pathname.includes('/readonly/')
                && !context.url.pathname.includes('/js/')
                && !context.url.pathname.includes('/css/'),
            handler: 'NetworkFirst',
            options: {
                cacheName: 'changing',
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        }
    ],
});