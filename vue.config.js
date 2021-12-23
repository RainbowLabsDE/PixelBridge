const path = require('path');
/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */

let vueSrcPath = path.join(__dirname, '/src/webinterface/frontend');

module.exports = {
    devServer: {
        port: 8081
    },

    // specify different source folder path as per https://github.com/vuejs/vue-cli/issues/3040
    outputDir: 'dist/webinterface/frontend/dist',
    configureWebpack: {
        context: vueSrcPath,
        resolve: {
            alias: {
              '@': path.join(vueSrcPath, '/src'),
            }
        }
    },

    pages: {
        index: {
            entry: path.join(vueSrcPath, 'src/main.ts'),
            template: path.join(vueSrcPath, 'public/index.html'),
            favicon: path.join(vueSrcPath, 'public/favicon.png'),
            filename: 'index.html',
            title: 'Pixelbridge Frontend',
        }
    },

    // // need to do this workaround for whatever reason, as pages template doesn't work 
    // // EDIT: only doesn't work when providing the wrong path, derp
    // chainWebpack: config => {
    //     config.plugin('html').tap(args => {
    //         if (!args || args.length === 0) return args;
    //         args[0].title = 'Pixelbridge Configurator';
    //         args[0].template = path.join(vueSrcPath, 'public/index.html');
    //         return args;
    //     });
    // }
}