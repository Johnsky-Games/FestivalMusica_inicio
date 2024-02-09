// Importación de módulos de Gulp
const { src, dest, watch, parallel } = require("gulp");

// Importación de plugins
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");

// Tarea para compilar CSS desde Sass
function css(done) {
  src("src/scss/**/*.scss") // Identificar el archivo SASS
    .pipe(plumber())
    .pipe(sass()) // Compilarlo
    .pipe(dest("build/css")); // Almacenarla en el disco duro

  done(); // Callback que avisa a gulp cuando llegamos al final
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

// Tarea de desarrollo que observa cambios en archivos SASS
function dev(done) {
  watch("src/scss/**/*.scss", css);

  done(); // Callback que avisa a gulp cuando llegamos al final
}

// Exportación de tareas
exports.css = css;
exports.versionWebp = versionWebp;
exports.dev = parallel(versionWebp, dev); // Se pueden llamar en la terminal con npm run "tarea" - npx gulp "tarea" - gulp "tarea"
