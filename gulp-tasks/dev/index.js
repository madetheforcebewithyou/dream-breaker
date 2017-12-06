import http from 'http';
import decache from 'decache';
import gulp from 'gulp';
import runSequence from 'run-sequence';
import gulpHelp from 'gulp-help';
import gulpUtil from 'gulp-util';
import chokidar from 'chokidar';
import Loadable from 'react-loadable';
import config from './config.js';
import createApp from './create_app.js';

gulpHelp(gulp);

gulp.task('dev:start', false, () => {
  const watcher = chokidar.watch([config.appRoot, config.loadableFilePath], {
    followSymlinks: false,
    alwaysStat: true,
    atomic: true,
    awaitWriteFinish: {
      stabilityThreshold: 1000,
      pollInterval: 100,
    },
  });

  watcher.on('ready', () => {
    let currentApp = createApp();

    Loadable.preloadAll()
    .then(() => {
      const server = http.createServer(currentApp).listen(config.port, (err) => {
        if (err) {
          gulpUtil.log(`cannot listen on ${config.port}`);
          return;
        }

        gulpUtil.log(`server listen on ${config.port}`);

        // watch
        watcher.on('all', (event, file) => {
          gulpUtil.log(`server reload, ${file} changed`);
          decache(file);
          decache(config.appRoot);

          // reload
          server.removeListener('request', currentApp);
          currentApp = createApp();
          server.on('request', currentApp);
        });
      });
    }).catch((err) => {
      gulpUtil.log(err);
    });
  });
});

gulp.task('dev', 'Start development server', (callback) => {
  runSequence('dev:start', callback);
});
