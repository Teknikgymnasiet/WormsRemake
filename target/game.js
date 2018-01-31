var typescript = require('gulp-typescript');
var gulp = require("gulp");
gulp.task('default', function () {
    var tsProject = typescript.createProject('tsconfig.json');
    var tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest("target/"));
});
