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
        server: { baseDir: 'app/'},
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



//=============================================
//новая функция которая будет обновлять автоматически страницу
//при любых изминениях - мы должны вотчить все js файлы - нужно смотреть в документацию - шаблоны Globs
function startWatch() {
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts) //так мы выбираем все js файлы в нашем проекте и одновременно ! знак идет после того как мы указали все файлы. Мы исключим все файлы из папки app/**/*.min.js
    //что происходит - чтобы не было рекурсивного обновления страницы - и рекурсивной сборки - как работает сценарий: мы сохраняем файл app.js - потом инициализируется сборка - все js файлы выгружаются app.min.js - (37.55 минута)
}


//установим sass - npm i --save-dev gulp-sass
//установим автопрефиксер npm i --save-dev gulp-autoprefixer - const autoprefixer = require('gulp-autoprefixer');
//потом подключим его через константу - pipe
//потом установим npm i --save-dev gulp-clean-css
//подключим через constant - pipe

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css')


//создаем функцию для обработки sass файлов
function styles() {
    return src('app/sass/main.sass')
        //используем нашу константу
        .pipe(sass())

        .pipe(concat('app.min.css'))

        //что делаем дальше -
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true})) //grid: true - подкючаем для того,чтобы работало в  ie

        .pipe(cleancss(({ level: {1: {specialComments: 0} }, format: 'beautify' }))) //level - уровень  , format: 'beautify'  - формат вывода

        //выводим в папку
        .pipe(dest('app/css/'))
}


//любые task которые будут использоваться нужно экспортировать - мы можем в экспорте создать
// комбинацию нужных task
exports.browsersync = browsersync; //теперь мы сделали экспорт данной функции в task
//запускаем в терминале - gulp browsersync

exports.scripts = scripts;
//запускаем в терминале - gulp scripts

exports.styles = styles;


//дефолтный task
exports.default = parallel(scripts, browsersync, startWatch)

