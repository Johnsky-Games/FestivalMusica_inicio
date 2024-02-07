const { src, dest } = require("gulp");
const sass = require("gulp-sass")(require('sass'));
function css(callback) {
  src("src/scss/app.scss") //Identificar el archivo SASS
    .pipe(sass()) //Compilarlo
    .pipe(dest("build/css")); //Almacenarla en el disco duro

  callback(); // Callback que avisa a gulp cuando llegamos al final
}

exports.css = css;
