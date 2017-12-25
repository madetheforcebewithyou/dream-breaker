import gulp from 'gulp';
import path from 'path';
import shell from 'gulp-shell';
import runSequence from 'run-sequence';
import gulpHelp from 'gulp-help';
import del from 'del';
import gulpUtil from 'gulp-util';
import babel from 'gulp-babel';

gulpHelp(gulp);

const config = {
  jsPath: [
    'app/**/*.js',
    '!app/**/__test__/*.js',
  ],
};

gulp.task('webpack', false,
  shell.task(
    `node_modules/.bin/webpack --progress --config ${path.join(__dirname, './webpack.config.babel.js')}`,
    {
      env: {
        NODE_ENV: 'production',
      },
    },
  ),
);

gulp.task('babel', false, () => {
  gulp.src(config.jsPath)
    .pipe(babel())
    .pipe(gulp.dest('build'));
});

gulp.task('clean', false, () => {
  del.sync(['build']);
  del.sync(['artifacts/**', '!artifacts', '!artifacts/.gitkeep']);
  gulpUtil.log('build cleaned');
});

gulp.task('build', 'Production build', ['clean'], (callback) => {
  runSequence(
    ['babel', 'webpack'],
    callback);
});
