/* eslint-disable import/no-extraneous-dependencies */
import gulp from 'gulp';
import requireDir from 'require-dir';
import gulpHelp from 'gulp-help';

requireDir('./gulp-tasks');
gulpHelp(gulp);
