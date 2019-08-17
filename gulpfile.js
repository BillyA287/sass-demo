const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const jshint = require('gulp-jshint');

const config = {
  outputDir: 'dist',
  ecmaVersion: 6
}

gulp.task('lint', () => {
  return gulp.src('src/js/main.js')
    .pipe(jshint({ 'esversion': config.ecmaVersion }))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('js', gulp.series('lint', () => {
  return gulp.src('src/js/*.js')
    .pipe(gulp.dest(`${config.outputDir}/js`))
    .pipe(browserSync.stream());
}));

gulp.task('html', () => {
  return gulp.src('src/*.html')
    .pipe(gulp.dest(`${config.outputDir}`))
    .pipe(browserSync.stream());
});

gulp.task('assets', () => {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest(`${config.outputDir}/assets`))
    .pipe(browserSync.stream());
});

gulp.task('sass', () => {
  return gulp.src('src/scss/*.scss')
    .pipe(sass(config.sassConfig))
    .pipe(gulp.dest(`${config.outputDir}/css`))
    .pipe(browserSync.stream());
});

gulp.task('clean', () => {
  return del(`${config.outputDir}`);
});

gulp.task('build', gulp.series('clean', gulp.parallel('html', 'assets', 'sass', 'js')));

// Static Server + watching scss/html files
gulp.task('serve', gulp.series('build', () => {
  browserSync.init({
    server: `./${config.outputDir}`
  });

  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('src/js/*.js', gulp.series('js'));
  gulp.watch('src/*.html', gulp.series('html')).on('change', browserSync.reload);
  gulp.watch('src/assets/**/*', gulp.series('assets')).on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('serve'));
