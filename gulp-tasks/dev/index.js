import http from 'http';
import decache from 'decache';
import gulp from 'gulp';
import runSequence from 'run-sequence';
import gulpHelp from 'gulp-help';
import gulpUtil from 'gulp-util';
import chokidar from 'chokidar';
import config from './config.js';
import createApp from './create_app.js';

gulpHelp(gulp);

gulp.task('dev:start', false, (done) => {
  const watcher = chokidar.watch(config.appRoot, {
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
    const server = http.createServer(currentApp).listen(config.port, (err) => {
      if (err) {
        gulpUtil.error(`cannot listen on ${config.port}`);
        done(err);
        return;
      }

      gulpUtil.log(`server listen on ${config.port}`);

      // watch
      watcher.on('all', () => {
        decache(config.appRoot);

        // reload
        server.removeListener('request', currentApp);
        currentApp = createApp();
        server.on('request', currentApp);
      });
    });
  });
});

gulp.task('dev', 'Start development server', (callback) => {
  runSequence('dev:start', callback);
});
