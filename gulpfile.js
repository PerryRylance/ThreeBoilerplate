const gulp			= require('gulp');
const rollup		= require('@rollup/stream');
const source		= require('vinyl-source-stream');
const buffer		= require('vinyl-buffer');
const sourcemaps	= require('gulp-sourcemaps');
const nodeResolve	= require('@rollup/plugin-node-resolve').nodeResolve;
const babel			= require("@rollup/plugin-babel").getBabelOutputPlugin;
const noop			= require("gulp-noop");
const terser		= require('gulp-terser');
const notifier		= require('node-notifier');

let devBuild		= false;
var cache;

gulp.task("js", function(done) {
	
	let rollupPlugins = [];
	
	if(!devBuild)
		rollupPlugins = [
			babel({
				presets: ['@babel/preset-env']
			})
		];
	
	return rollup({
		input: './src/js/entry.js',
		plugins: [
			nodeResolve()
		],
		cache: cache,
		output: {
			sourcemap: true,
			dir: "./dist/js",
			format: "esm",
			plugins: rollupPlugins
		}
	})
	.on('error', function(e) {
		
		console.log(e);
		
		notifier.notify({
			title: 'Gulp',
			message: 'Build failed.',
			sound: true
		});
		
		done();
		
	})
	.on("bundle", function(bundle) {
		
		cache = bundle;
		
		notifier.notify({
			title: 'Gulp',
			message: 'Build completed successfully.'
		});
		
	})
	.pipe(source('bundle.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(devBuild ? noop() : terser())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest('./dist/js'));
	
});

gulp.task("js:watch", function(done) {
	gulp.watch(["./src/js/**/*.js"], gulp.series("js"));
	done();
});

gulp.task("default", gulp.series("js", "js:watch"));
gulp.task("dev", gulp.series(done => { 
	devBuild = true; 
	console.log("Development build - Babel and Terser will not be used.");
	done();
}, "js", "js:watch"));
