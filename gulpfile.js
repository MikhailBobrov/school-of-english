const { src, dest, parallel, series, watch } = require('gulp');  //подключаем gulp, используем константу, которая содержит несколько значений
//require - функция ктр подключает пакеты из папки node modules в наш проект и присваивает их константе или переменной



//=============================================================================
//установим live server ктр автоматически мониторит изм в файлах и обновдяет страницу
// npm i browser-sync --save-dev     - данной командой

//подключаем browser-sync
const browserSync = require('browser-sync').create(); //необходимо указать параметр подкючения - .create()

//подключаем concat к проекту
const concat = require('gulp-concat'); //вообще все названия мы подключаем выше - в самом начале

const uglify = require('gulp-uglify-es').default;







//сейчас пишем функцию ктр будет подключать browser-sync, но эта функция не является task  - (browsersync пишем с маленькой буквы чтобы не совпадало с константой)
//browserSync - у каждого пакета gulp есть своя документация -  https://www.browsersync.io/docs  https://www.npmjs.com/package/browser-sync
function browsersync() {
    //1-инициализируем browserSync.init
    browserSync.init({
                                                            //2 прописываем параметры - путь до папки из которой сервер будет брать файлы - app
                                                            //через , (запятую) указываем необходимые нам параметры
        server: { baseDir: 'app/' },
        notify: false, //отключили уведомления
        online: true, //browsersync - нужна сеть, если мы хотим работать без сети без интернета используем параметр online: false
        // // и после этого обязательно экспортируем - exports.browsersync = browsersync; - 62 строка

    })
}







//как работает gulp с файлами - gulp работает таким образом что у него есть какие то данные на входе , он с ними что то
// делает с помощью встроенных функций или подключенных плагинов и он выгружает готовый результат в другую
// папку - более подробно можно ознакомится в Шаблоны Globs - Шаблоны Globs

//scripts() - будет обрабатывать скрипты нашего проекта
function scripts() {
    //возвращаем функцию и пишем что мы делаем с файлом одной строкой - берем исходник src('app/js/app.js')
    //с этим файлом далее - необходимо их конкатенировать если их несколько js файлов [ через запятую и квадратные скобки ]
    //обратите внимание - если этот app.js будет использовать функции jquery (ктр мы установили для примера -  npm i --save-dev jquery) или
    // другого фреймворка то данный файл должен быть в конце

    //еще скрипты можно сжать и сделать их компактные - используем модуль gulp-uglify-es - установим его - (после jquery)
    //npm i --save-dev gulp-uglify-es - подключаем правильно - выносим в константу, делаем в return -  .pipe(uglify())
    //

    return src([

        'node_modules/jquery/dist/jquery.min.js',
        'app/js/app.js',

    ])
        //теперь мы эти файлы конкатинируем - операция в комбайне выполняется с
        // помощью функции pipe - в ней мы прописываем что нам нужно сделать - конкатенировать concat - отдельный модуль, ктр мы используем
        //.pipe(concat('........'))  - в точки в скобках мы указываем путь куда будут сгружаться все файлики из src - app.min.js
        //подключаем в терминале concat - npm i --save-dev gulp-concat
        .pipe(concat('app.min.js'))

        //создаем новую функцию в комбайне, ктр будет сжимать наши скрипты
        .pipe(uglify())

        //выгружаем все что у нас получилось во внешний файл - используем dest('путь куда выгружаем')
        // и после этого обязательно экспортируем - exports.scripts = scripts - 65 строка
        .pipe(dest('app/js/'))

        //делаем еще один pipe - в котором гвоорим что нужно делать browsersync - даем команду stream - слежение без перезагрузки
        .pipe(browserSync.stream())

}









//установим sass - npm i --save-dev gulp-sass
//установим автопрефиксер npm i --save-dev gulp-autoprefixer - const autoprefixer = require('gulp-autoprefixer');
//потом подключим его через константу - pipe
//потом установим npm i --save-dev gulp-clean-css
//подключим через constant - pipe

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css')
let preprocessor = 'sass'

//создаем функцию для обработки sass файлов
function styles() {
    return src('app/' + preprocessor + '/main.' + preprocessor + '')
        //используем нашу константу
        .pipe(eval(preprocessor)())


        .pipe(concat('app.min.css'))

        //что делаем дальше -
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true})) //grid: true - подкючаем для того,чтобы работало в  ie

        .pipe(cleancss(({ level: {1: {specialComments: 0} }, format: 'beautify' }))) //level - уровень  , format: 'beautify'  - формат вывода - Также мы видим закомментированный параметр format: 'beautify'. Если мы его раскомментируем, на выходе мы получим не максимально сжатый CSS код, а наоборот, развёрнутый и читаемый.

        //выводим в папку
        .pipe(dest('app/css/'))

        //делаем еще один pipe - в котором гвоорим что нужно делать browsersync - даем команду stream - слежение без перезагрузки
        .pipe(browserSync.stream())
}








//===============РАБОТА с ИЗОБРАЖЕНИЯМИ - для того чтобы работать с изображениями нам нужен соотвествующий
// модуль - gulp image min. - установка npm i --save-dev gulp-imagemin - у него настройки по умолчанию дают
// афигенный результат

//дополнительно нужно следить за теми изображениями которые уже были сжаты - установим дополнительный
// пакет npm i --save-dev gulp-newer  - вычисляет файлы которые уже были изменены и их уже не трогает

const imagemin = require("gulp-imagemin");
const newer = require('gulp-newer');
const del = require('del')

function images() {
    return src('app/img/src/**/*')
        .pipe(newer('app/img/dest')) //проверяем тут на переиспользование - если оптимизировали ранее то не будем больше - в ней мы указываем путь куда мы складываем изображения - dest
        .pipe(imagemin())
        .pipe(dest('app/img/dest'))
}


//npm i --save-dev gulp-webp
const webp = require('gulp-webp');

function webP() {
    return src('app/img/src/**/*.{png,jpg}')
        .pipe(webp({quality: 90}))
        .pipe(dest("app/img/dest"));
}

// npm i --save-dev gulp-svgstore
// npm i --save-dev gulp-rename

const svgstore = require("gulp-svgstore");
const rename = require("gulp-rename");

function sprite() {
    return src("app/img/src/icon-*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(dest("app/img/dest"));
}


//в работе с изображениями иногда необходимо отчистить всю папку dest - ту папку куда мы загружаем изображения - пишем вспомогательный task - cleanimg
//дополнительно установим пакет del - у самого gulp нет развитой системы для быстрого удаления из файлов системы - npm i --save-dev del

function cleanimg() {
    return del('app/img/dest/**/*', { force: true})
}

//добавим функцию очищения папки dist - удалим папку dist - return del
function cleandist() {
    return del('dist/**/*', { force: true})
}

//добавим новую функцию которая будет копировать - сделаем таск который будет собирать все и копировать в отдельную папку
function buildcopy() {
    return src([
        'app/css/**/*.min.css',
        'app/js/**/*.min.js',
        'app/img/dest/**/*',
        'app/**/*.html',
        ], { base: 'app' })
        .pipe(dest('dist'));

}
//base - сделаем с помощью base в dist нормальное адекватное вложение base: 'app' - это путь откуда мы берем все это хозяйство
//dist - папка куда выгружается готовый проект - это типо build в академии


//=============================================
//новая функция которая будет обновлять автоматически страницу
//при любых изминениях - мы должны вотчить все js файлы - нужно смотреть в документацию - шаблоны Globs
function startWatch() {
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts); //так мы выбираем все js файлы в нашем проекте и одновременно ! знак идет после того как мы указали все файлы. Мы исключим все файлы из папки app/**/*.min.js
    //что происходит - чтобы не было рекурсивного обновления страницы - и рекурсивной сборки - как работает сценарий: мы сохраняем файл app.js - потом инициализируется сборка - все js файлы выгружаются app.min.js - (37.55 минута)
    watch('app/**/' + preprocessor + '/**/*', styles);
    watch('app/**/*.html').on('change', browserSync.reload)
    watch('app/img/src/**/*', images);
    watch('app/img/src/**/*', webP);
    watch('app/img/src/**/*', sprite);
}











//то есть это команды терминала через gulp ... gulp browsersync, gulp scripts.... и тд
//любые task которые будут использоваться нужно экспортировать - мы можем в экспорте создать
// комбинацию нужных task
exports.browsersync = browsersync; //теперь мы сделали экспорт данной функции в task
//запускаем в терминале - gulp browsersync

exports.scripts = scripts;
//запускаем в терминале - gulp scripts

exports.styles = styles;

exports.images = images;

exports.webP = webP;

exports.sprite = sprite;

exports.cleanimg = cleanimg;

exports.build = series(cleandist, styles, scripts, images, buildcopy)

//series - это последовательно

//дефолтный task - Дефолтный таск exports.default позволяет запускать проект одной командой gulp в терминале.
exports.default = parallel(styles, scripts, browsersync, startWatch)

