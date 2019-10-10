/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-env node */
const gulp = require('gulp');
const scaffold = require('static-site-scaffold/lib/gulp.config')(gulp);

/**
 * Watches a Sass glob and runs compileSass
 *
 * @return {object} Gulp watch object
 */
function watchSass() {
  return gulp.watch('./src/sass/**/*.scss', scaffold.sass);
}

gulp.task('sass', scaffold.sass);
gulp.task('watch:sass', gulp.parallel(scaffold.sass, watchSass));

// Static Assets

/**
 * Watches images and runs moveImages
 *
 * @return {object} Gulp watch object
 */
function watchImages() {
  return gulp.watch('./src/images/**/*', scaffold.images);
}

/**
 * Watches videos and runs moveVideos
 *
 * @return {object} Gulp watch object
 */
function watchVideos() {
  return gulp.watch('./src/videos/**/*', scaffold.videos);
}

/**
 * Watches fonts and runs moveFonts
 *
 * @return {object} Gulp watch object
 */
function watchFonts() {
  return gulp.watch('./src/fonts/**/*', scaffold.fonts);
}

/**
 * Watches manifest and service worker and runs movePWA
 *
 * @return {object} Gulp watch object
 */
function watchPWA() {
  return gulp.watch(['./src/manifest.json', './src/sw.js'], scaffold.pwa);
}

gulp.task('server', gulp.parallel(scaffold.server, scaffold.external));
gulp.task('build:static', gulp.parallel(scaffold.images, scaffold.videos, scaffold.fonts, scaffold.pwa));
gulp.task('watch:static', gulp.parallel(watchImages, watchVideos, watchFonts, watchPWA));

// ////////////////////////////
// Pipelines
// ////////////////////////////
gulp.task('build', gulp.series(gulp.parallel('sass', 'build:static'), scaffold.html));
gulp.task('watch', gulp.parallel('watch:sass', 'watch:static'));
gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'server')));
