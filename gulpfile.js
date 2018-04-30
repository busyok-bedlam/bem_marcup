const   gulp = require('gulp'),
        pug = require('gulp-pug')
        sass = require('gulp-sass'),
        plumber = require('gulp-plumber'),
        concat = require('gulp-concat'),
        prefix = require('gulp-autoprefixer'),
        browserSync = require('browser-sync').create(),
        useref = require("gulp-useref"),
        gulpif = require("gulp-if"),
        jslint = require("gulp-jslint"),
        rimraf = require("rimraf"),
        cssmin = require("gulp-cssmin"),
        uglify = require("gulp-uglify")
        path = {
            devDir: "app/",
            blockDir: "blocks/",
            outputDir: "build/"
        }
// PUG COMPILE
    gulp.task('pug',() => {
        gulp.src([path.blockDir + "**/*.pug", "!" + path.blockDir + "template.pug"])
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.devDir))
        .pipe(browserSync.stream())
    })
// SASS COMPILE
    gulp.task('sass',() => {
        gulp.src(path.blockDir + '*.sass')
        .pipe(plumber())
        .pipe(sass())
        .pipe(prefix({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(path.devDir + "css/"))
        .pipe(browserSync.stream())
    })
// JS CONCAT
    gulp.task('scripts',() => {
        return gulp.src([
            path.blockDir + '**/*.js',
            "!" + path.blockDir + "_assets/**/*.js"
        ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(path.devDir + 'js/'))
        .pipe(browserSync.stream())
    })
// AUTORELOADER
    gulp.task('browser-sync',() => {
        browserSync.init({
            port: 3000,
            server: {
                baseDir: path.devDir
            }
        })
    })

    gulp.task("clean",cb => {
        rimraf(path.outputDir, cb)
    })
// BUILD
    gulp.task("build",['clean'],() => {
        return gulp.src(path.devDir + "*.html")
        .pipe(useref())
        .pipe(gulpif("*.js",uglify()))
        .pipe(gulpif("*.css",cssmin()))
        .pipe(gulp.dest(path.outputDir))
    })
// WATCHER
    gulp.task('watch', () => {
        gulp.watch('./blocks/**/*pug', ['pug']);
        gulp.watch(path.blockDir + '**/*.sass', ['sass']);
        gulp.watch(path.blockDir + '**/*.js', ['scripts']);
    })
// DEFAULT TASK
    gulp.task('default',['browser-sync','watch','pug','sass','scripts'])