// Importación de módulos de Gulp
const { src, dest, watch, parallel } = require("gulp");

// Importación de plugins
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

//Imagenes
const cache = require('gulp-cache')
const imagemin = require('gulp-imagemin')
const avif = require('gulp-avif');

//Java script

const terser = require('gulp-terser-js');

// Tarea para compilar CSS desde Sass
function css(done) {
  src("src/scss/**/*.scss") // Identificar el archivo SASS
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass()) // Compilarlo
    .pipe(postcss([autoprefixer(), cssnano]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/css")); // Almacenarla en el disco duro

  done(); // Callback que avisa a gulp cuando llegamos al final
}

// Aligerear imagenes con gulp

function imagenes(done) {
  const opciones = {
    optimizationLevel: 3
  }
  src('src/img/**/*.{png,jpg}')
    .pipe(cache(imagemin(opciones)))
    .pipe(dest('build/img'))
  done();
}



// Tarea para convertir imágenes a formato WebP
function versionWebp(done) {
  import("gulp-webp")
    .then((webp) => {
      const options = {
        quality: 50,
      };
      src("src/img/**/*.{png,jpg}")
        .pipe(webp.default(options))
        .pipe(dest("build/img"));
      done();
    })
    .catch((error) => {
      console.error("Error al importar gulp-webp:", error);
      done(error);
    });
}

// Tarea para convertir imágenes a formato Avif

function versionAvif(done) {
  const options = {
    quality: 50,
  };
  src("src/img/**/*.{png,jpg}")
    .pipe(avif(options))
    .pipe(dest("build/img"));

  done();
}

function javascript(done) {
  src('src/js/**/*.js')
  .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(dest('build/js'));
  done();
}


// Tarea de desarrollo que observa cambios en archivos SASS
function dev(done) {
  watch("src/scss/**/*.scss", css);
  watch("src/js/**/*.js", javascript);

  done(); // Callback que avisa a gulp cuando llegamos al final
}

// Exportación de tareas
exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev); // Se pueden llamar en la terminal con npm run "tarea" - npx gulp "tarea" - gulp "tarea"
