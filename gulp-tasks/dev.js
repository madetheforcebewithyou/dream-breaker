import gulp from 'gulp';
import runSequence from 'run-sequence';
import gulpHelp from 'gulp-help';
import server from 'gulp-develop-server';

gulpHelp(gulp);

const config = {
  serverFilePath: [
    'app/**/*.js',
  ],
  mainPath: 'main.js',
};

gulp.task('dev:start', false, () => {
  server.listen({ path: config.mainPath });
});

gulp.task('dev:watch', false, () => {
  gulp.watch(config.serverFilePath, server.restart);
});

gulp.task('dev', 'Start development server', (callback) => {
  runSequence(
    'dev:start',
    'dev:watch',
    callback);
});
