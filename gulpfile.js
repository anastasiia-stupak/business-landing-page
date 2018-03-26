const gulp = require('gulp');
const browserSync = require('browser-sync');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');

const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

// ------- Server ---------

gulp.task('server', function () {
	browserSync.init({
		server: {
			port: 9000,
			baseDir: "build/"
		}
	});

	gulp.watch('build/**/*').on('change', browserSync.reload);
});

// ------- Pug Compile ---------

gulp.task('templates:compile', function buildHTML() {
	return gulp.src('src/template/index.pug')
		.pipe(pug({
		       pretty: true
	       }))
		.pipe(gulp.dest('build'))
});

// ------- Sass Compile ---------

gulp.task('styles:compile', function () {
	// return gulp.src('src/styles/main.scss')
	// 	.pipe(sourcemaps.init())
	// 	.pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
	// 	.pipe(autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
	// 	.pipe(rename('main.min.css'))
	// 	.pipe(sourcemaps.write('.'))
	// 	.pipe(gulp.dest('build/css'))

	return gulp.src('src/styles/main.scss')
		.pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest('build/css'))

});

// ------- Sprites ---------

gulp.task('sprite', function (cb) {
	const spriteData = gulp.src('src/images/icons/*.png')
		.pipe(spritesmith({
			imgName: 'sprite.png',
			imgPath: '../images/sprite.png',
			cssName: 'sprite.scss'
		}));

		spriteData.img.pipe(gulp.dest('build/images/'));
		spriteData.css.pipe(gulp.dest('src/styles/global/'));

		cb();
});

// ------- Clean ---------

gulp.task('clean', function (cb) {
	return rimraf('build', cb)
});

// ------- Copy Fonts ---------

gulp.task('copy:fonts', function () {
	return gulp.src('src/fonts/**/*.*')
		.pipe(gulp.dest('build/fonts'));
});

// ------- Copy Images ---------

gulp.task('copy:images', function () {
	return gulp.src('src/images/**/*.*')
		.pipe(gulp.dest('build/images'));
});

// ------- Copy Both ---------

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

// ------------ Watchers -----------

gulp.task('watch', function () {
	gulp.watch('src/template/**/*.pug', gulp.series('templates:compile'));
	gulp.watch('src/styles/**/*.scss', gulp.series('styles:compile'))
});


// ------------ Default -----------

gulp.task('default', gulp.series(
		'clean',
		gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
		gulp.parallel('watch', 'server')
	)
);



