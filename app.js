const express = require(`express`); 
// ИМПОРТИРуем модуль express ИЗ Node.js 
// (предварительно загруженный из NPM - см. файл package.json и ОПИСАНИЕ файл- NPMpackage.json - ОТКРЫТ В Sublime Text)  

const app = express(); 
// формально ФРЕЙМВОРК express - это ФУНКЦИЯ !!! - которую необходимо импортировавть (стр.1) и ЗАПУСТИТЬ (стр.5)

const PORT = 3000; // Номер Порта - 3000

const url = require(`url`); // ИМПОРТИРуем модуль url ИЗ Node.js - для работы с ОБЪЕКТОМ Url (стр. 225-240)

const nodemailer = require("nodemailer"); //ИМПОРТИРуем модуль ПОЧТОВОГО СЕРВИСА (стр. 780) из NPM 

// Необходимо указать ПОРТ кторорый будет слушать Сервер - При помощи Метода - listen
// listen - принимает:
//                     1) Номер Порта - 3000
//                     2) Имя ХОСТА (сервера) - `localhost` (МОЖНО НЕ ПРОПИСЫВАТЬ)
//                     3) Сall-back ф-цию - в качестве аргумента - добавим информацию,
//                                          что слушаем определенный порт


app.listen(PORT, `localhost`, (error) => {
  if (error) { 
    console.log(error);
  } else {
    console.log(`Запустился ПАКЕТ-nodemon и express. Слушаем ПОРТ ${PORT}`);
  };
});
// ___________________________________________________________________________________
//_____________________ Установим ШАБЛОНИЗАТОР ejs________________________
// (предварительно загруженный из NPM - см. файл package.json и ОПИСАНИЕ файл- NPMpackage.json - ОТКРЫТ В Sublime Text)  

// Устанавливаем NPM Модуль pug (ШАБЛОНИЗАТОР) -> В КАЧЕСТВЕ ДВИЖКА view engine______
app.set(`view engine`, `pug`);
 
// https://gist.github.com/neretin-trike/53aff5afb76153f050c958b82abd9228
// https://pugjs.org/language/attributes.html

// По умолачанию express ищет шаблоны (ф-лы.pug, которые мы будем возвращать на страницу или в БД) в папке views. Если мы хотим задать другую папку для шаблонов, то используем команду: app.set('views', './views')-где второй параметр - это путь к папке шаблонов pug. Мы можем создавать любую иерархию папок внутри папки шаблонов.

// _____________________________________________________________________________________
//                        Пропишем ПРОМЕЖУТОЧНОЕ ПО (Middleware)  -  app.use(); 
//                            ВАЖНО !!! -  ДО роутинга с Ответом ФАЙЛОВ
// Node.js ЗАЩИЩАЕТ СТАТИЧНЫЕ ДАННЫЕ-> 
// когда мы добавляем какие-то Статичные ф-лы в проект (КАРТИНКИ или ФАЙЛ СТИЛЕЙ или JS-ФАЙЛ) -
// мы НЕ МОЖЕМ ПОЛУЧИТЬ К НИМ ДОСТУП (Пользователь НЕ МОЖЕТ ПОЛУЧИТЬ ДОСТУП к ЛЮБОМУ Ф-ЛУ хранящемуся НА СЕРВЕРЕ !!!)

// Необходимо написать ПРОМЕЖУТОЧНОЕ ПО (Middleware) - которое Определяет Ф-лы или Папки
 // к которым на сервере Можно получить Доступ

 app.use(express.static(`public`)); // Добваляем ПАПКУ publick в ИСКЛЮЧЕНИЯ - т.е. делаем ее ОБЩЕДОСТУПНОЙ

//  Cервер на Node.js и Express ПО УМОЛЧАНИЮ - НЕ ДАЕТ ДОСТУП КО ВСЕМ ПАПКАМ (КРОМЕ ТЕХ, ЧТО ПРОПИСАНЫ В ИСКЛЮЧЕНИЯХ - стр.48 и ПАПКИ views)
// ______________________________________________________________________________________

//_____________________ для обработки POST - ЗАПРОСА ________________________

// Добвавим Middleware - для ПАРСИНГА (один формат данных превращается в другой, более читаемый. 
// [Декодирование] входящего ЗАПРОСА - express.urlencoded()

// Ранее широко исспользовался Сторонний NPN Модуль - bodyparcer, но теперь эта логика интегрирована в express

app.use(express.urlencoded({extended:false})); // аргумент {extended:false} - говорит о том, 
// что расширенный парсинг нам НЕ НЕЖЕН

// Если в запросе на сервер присутствует : headers: {
//               (card.js - стр. 106-109)            "Accept": "application/json",
//                                                    "Content-Type" : "application/json"
//                                                  }  - то необходим СЛЕДУЮЩИЙ МОДУЛЬ: 
app.use(express.json()); // app.use(express.urlencoded({extended:false})); - МОЖНО ЗАКОМЕНТИРОВАТЬ

// далее СОЗДАЕМ РОУТ  - app.post() - стр. 416; 496


// ________________________________ПОДКЛЮЧЕНИЕ К (Локальной) - MySQL БД _________________________________________


const mysql = require(`mysql2`) // ИМПОРТИРуем модуль mysql2  
// (предварительно загруженный из NPM - см. файл package.json и ОПИСАНИЕ файл- NPMpackage.json - ОТКРЫТ В Sublime Text)

// Модуль mysql2 кроме стандартного подключения к БД (mysql) - может работать с ПОСЛЕДОВАТЕЛЬНЫМИ ЗАПРОСАМИ к БД - Node(MongoDB-MySQL).js стр. 2722-2856


// Описание комманд https://www.npmjs.com/package/mysql (стр. 86-102 взято из описания Establishing connections)

const connection = mysql.createConnection({ //создаем КОНФИГУРАЦИЮ подключения - формируем ОБЪЕКТ (c параметрами для подключения - ЛОКАЛЬНАЯ БД)

  host     : 'localhost', // либо: 127.0.0.1 (Внутри phpMyAdmin Сервер: 127.0.0.1:3306 - но сюда пишем localhost)
  user     : 'root', // либо: root@localhost (root- Обязательно !!!!!)
  password : 'root', // root- Обязательно !!!!!
  database : 'lite_shop'

});
 
connection.connect((err) => {// ПОДКЛЮЧЕНИЕ к БД
  if (err) {
    console.log(err); 
    return err;
  } else {
    console.log(`Connected .... MySQL DB lite_shop`);
  }
});

// ЧЕРЕЗ 3 (ТРИ) МИНУТЫ - Error: Connection lost: The server closed the connection.
//        1) (CTRL+S) - Поэтому nodemon - обязательно (АВТОМАТОМ ПЕРЕЗАГРУЗИТ ПРИЛОЖЕНИЕ И ВОССТАНОВИТ СВЯЗЬ С БД !!!!!) 

//        2) const connection = mysql.createPool({}) - Создаем ПУЛ подключений (а не одно ) - cтр. 86 и Полностью убрать ПОДКЛЮЧЕНИЕ - стр. 95-102 

// __________________________________________________________________________________________________________ 


//                  Рализуем РОУТИНГ ФАЙЛОВ - ИЗ ПАПКИ views

// Прописываем логику ЗАПРОСА (req) на СЕРВЕР и его ОТВЕТА (res)
// ____________________________________________________________

//1) Метод get- Обычный ЗАПРОС Данных

//  "/" - "Косая" - ОСНОВНОЙ ПУТЬ (URL) захода на Сервер)
//   
//   Сall-back ф-ция (req, res)=>{}  - Вызывается Каждый Каз когда к 
//                                     серверу происходит обращение 

//                           - В качестве аргументов Сall-back ф-ции- 
//                             req, res - Объекты Запроса и Овета

//                             req - это URL адресс, который приходит в Запросе
//                             res - Объект котрый мы будем Формировать и Отправлять
//                             в БРАУЗЕР (клиент) - как ОТВЕТ

// 2) ВНУТРИ МЕТОДА get

//Возвращаем ЛЮБОЙ PUG-ФАЙЛ - исспользуя Метод render()- т.к. исспользуем ШАБЛОНИЗАТОР- Pug; стр.34 (или Handlebars или ejs)

//         res.render(`help.pug`); 
       
        // 1) Такой синтаксис вывода ф-ла help.pug -> РАБОТАЕТ - если нужные ф-лы РАЗМЕЩЕНЫ В ПАПКЕ views (если в другой папке - РАБОТАТЬ НЕ БУДЕТ!!!). В папке views - по умолачанию express ищет шаблоны (ф-лы.pug, которые мы будем возвращать на страницу или в БД).

// ____________________________________________________________________________


// _____ Возвращаем ф-л: views/help.pug  - для отработки ЗАПРОСА К БД - внутри PUG-файла ) _____

 app.get(`/help`, (req, res)=>{ // http://localhost:3000/help 

  console.log(`Произведен ${req.method}-запрос на СЕРВЕР http://localhost:3000/help`); 

//                     Создаем SQL-ЗАПРОСЫ в БД MySQL (см. MySQL-DB.html -cтр. 45-315)

//   1) Создаем СТРОКУ ЗАПРОСА   [queryString - Дословно СТРОКА ЗАПРОСА]
     let queryString_1 = `SELECT * FROM goods`; // Выбрать ВСЮ Таблицу googs из БД lite_shop (стр.91)

//   2) Связываемся с БД - через const connection - которая описывает соединение с БД (стр. 86) и Метод - query()

     connection.query(queryString_1, (err, result, field) =>{
  //               СТРОКА ЗАПРОСА,  ошибка, результат, поля с которыми необходимо работать (можно Не прописывть)

        console.log(err); // если НЕТ ОШИБКИ - null

  //      console.log(result); // Массив-Объектов

  //                             [
  //                               {
  //                                 id: 1,
  //                                 name: 'Asus VivoBook D540NA-GQ211T',
  //                                 description: 'Екран 15.6" (1366x768) WXGA HD, ....,
  //                                 cost: 7999,
  //                                 image: 'asus_d540na_gq211t_images_10642535768.jpg',
  //                                 category: 1
  //                               },
  //                               {
  //                                 id: 2,
  //                                 name: 'Ноутбук Lenovo IdeaPad 330-15AST',
  //                                 description: 'Екран 15.6" TN+film (1366x768) HD, матовий...',
  //                                 cost: 6499,
  //                                 image: 'lenovo_81d600jyra_images_10442255288.jpg',
  //                                 category: 1
  //                               }, {id: 3,..}, ... {id: 15,..} 
  //                             ] 


  //   Произведем ПЕРЕПАКОВКУ Массива-Объектов в ОБЪЕКТ-ОБЪЕКТОВ С КЛЮЧАМИ = id (ArrayHelper) (см. Наработки.html - cтр. 1012-1111)

    let goods = {}; // Cоздаем ПУСТОЙ ОБЪЕКТ

      for (var i = 0; i < result.length; i++) { 
        // прокручиваем в ЦИКЛЕ Массив -Объектов result

      //  В цикле КЛЮЧАМ goods(cтр 184) -> Присваиваем Значение - Объект, который является i-тым значением Массива result (стр.160)
          goods[result[i][`id`]] = result[i];// { 
                                             //  `1` :  {id: 1, name: 'Asus VivoBook', description: 'Екран 15.6"', cost: 7999, …},
                                             //  `2` :  {id: 2, name: 'Ноутбук Lenovo', description: 'Екран 15.6"', cost: 6499, …},
                                             //  `3` : {id:3, ...},  `4` : {id:4, ...},  `5` : {id:5, ...}, .....
                                             // }
      };
        
        console.log(goods);

    // Если консоли будет: { 
    //                      `1` : RowDataPacket  {id: 1, name: 'Asus VivoBook', description: 'Екран 15.6"', cost: 7999, …},
    //                      `2` : RowDataPacket  {id: 2, name: 'Ноутбук Lenovo', description: 'Екран 15.6"', cost: 6499, …},
    //                      `3` : RowDataPacket: {id:3, ...},  `4` RowDataPacket: {id:4, ...}, ....
    //                     }

    // То, чтобы убрать RowDataPacket: 

    //                                console.log(JSON.parse(JSON.stringify(goods)));

        //  ________________________________________________________________________________________________________

        //                                     Возвращаем ф-л: views/main.pug
       
        res.render(`help.pug`,  { 
                                  //  myGoods : JSON.stringify(goods)  -  Выводим ВСЕ данные виде JSON.строки - такой синтаксис - если видим RowDataPacket (стр.199-203)
                                  
                                  myGoods : goods // Ключу  myGoods - присваиваем Объект goods - скоторым будем работать в main.pug

                                }); 
      // 2) Значения Объекта { myGoods : goods} - можно вытянуть в тегах <p> и  <img> в ф-ле help.pug - стр. 45-51.
  });
});
// ______________________________________________________________________________

//__________________________ Возвращаем ф-л: views/cat.pug ___________________________

app.get('/cat', (req, res)=> { //http://localhost:3000/cat?id=1 (Выбираем только Ноутбуки)
                              // http://localhost:3000/cat?id=2 (Выбираем только Телефоны)

 

  console.log(req.method); // GET

  // Импортируем модуль url ИЗ Node.js - для работы с ОБЪЕКТОМ Url (стр. 10);
  console.log(req.url); // Путь: /cat?id=2 (стр.226, 227)

  let urlRequest = url.parse(req.url, true); //  для URL: http://localhost:3000/cat?id=2
//   console.log(urlRequest);

//   Url { protocol: null, slashes: null, auth: null, host: null, port: null, hostname: null, ash: null,
//                                    search: '?id=2',

//                                    query: [Object: null prototype] { id: '2' },

//                                    pathname: '/cat',
//                                    path: '/cat?id=2',
//                                    href: '/cat?id=2'
//                                  }
  console.log(req.query.id); // 2 - стр.242 (в таблице -  category - есть ДВА id; id=1(Ноутбуки); id=2(Телефоны) - т.е в Запросе к Таблице по Выбранному id - можно сделать выборку либо по Ноутбукам, либо по Телефонам
  let catId = req.query.id; // стр. 242

  console.log(`Произведен ${req.method}-запрос на СЕРВЕР http://localhost:3000/cat?id=${catId}`); 

  // Реализуем ЗАПРОС к Таблицам 1) category и 2) goods; БД - lite_shop - подключена стр. 86-93
  // Реализация запроса - через Promise (разбитого на 2 части) - см. наработки.html - стр.1284-1375

    // Создаем ПРОМИС promiseCat - для выборки из таблици category
    let promiseCat = new Promise(function (resolve, reject) {
     //                     Создаем SQL-ЗАПРОСЫ в БД MySQL (см. MySQL-DB.html -cтр. 45-315)

     //   1) Создаем СТРОКУ ЗАПРОСА   [queryString - Дословно СТРОКА ЗАПРОСА]
      let queryString_2 = `SELECT * FROM category WHERE id=${catId}`; // Выьрать ВСЕ, где есть id=2 (либо 1)

      //   2) Связываемся с БД - через const connection - которая описывает соединение с БД (стр. 86) и Метод - query()

        connection.query(queryString_2, (err, result) =>{
        //          СТРОКА ЗАПРОСА,  ошибка, результат  - Массив-Объектов стр.294-302
          // if (err) reject(err);
          resolve(result); //в выполнение Ф-ЦИИ resolve()  - ПОМЕЩАЕМ (Прочитать тело ответа (body: (...)) как Массив-Объектов)
        });
     });

    // Создаем ПРОМИС - для выборки из таблици goods
    let promiseGoods = new Promise(function (resolve, reject) {
      //                     Создаем SQL-ЗАПРОСЫ в БД MySQL (см. MySQL-DB.html -cтр. 45-315)
  
      //   1) Создаем СТРОКУ ЗАПРОСА   [queryString - Дословно СТРОКА ЗАПРОСА]
      let queryString_3 = `SELECT * FROM goods WHERE category=${catId}`; // Выьрать ВСЕ, где есть category=2 (либо 1)
  
      //   2) Связываемся с БД - через const connection - которая описывает соединение с БД (стр. 86) и Метод - query()

        connection.query(queryString_3, (err, result) =>{
         //          СТРОКА ЗАПРОСА,  ошибка, результат  - Массив-Объектов стр.306-313
          // if (err) reject(err);
          resolve(result); //в выполнение Ф-ЦИИ resolve()  - ПОМЕЩАЕМ (Прочитать тело ответа (body: (...)) как Массив-Объектов)
         });
      });   

      //  Метод Promise.all()  -  возвращает МАССИВ значений всех переданных промисов, при этом СОХРАНЯЯ ПОРЯДОК ОРИГИНАЛЬНОГО (переданного) МАССИВА, но не порядок выполнения. -  https://doka.guide/js/promise-all/

      Promise.all([promiseCat, promiseGoods]) // ВЫПОЛНЯЕМ ОБА созданных Промиса -> Выдаем  МАССИВ ВСЕХ данных по обеим запросам
      .then(function (values) {
       //          console.log(values[0]);  ( для URL: http://localhost:3000/cat?id=2)

        //             [ В Таблице category - будет выбрана строка с id=2 (стр.268)
        //               {
        //                 id: 2,
        //                 category: 'Телефоны',
        //                 description: 'Разнообразные смартфоны .... Распространенными компаниями являются 
        //                 Samsung, Apple, Lenovo, Xiaomi, Meizu, Sony и т.д.',
        //                 image: '75093.120x150.jpg'
        //               }
        //             ]

        //         console.log(values[1]);

        //           [ В Таблице goods - будут выбраны строки с categogy=2 (стр.284)
        //             {
        //               id: 10, name: 'Samsung Galaxy', description: 'Экран..', cost: 6199, image:'samsung.jpg',
        //               category: 2
        //             },
        //             { id: 11,.., category: 2}, {id: 12,...category: 2}, {id: 13, ...category: 2}, {id: 14,...category: 2},
        //             { id: 15,..,category: 2}
        //           ]

        // в Метод render() -> Передаем 1) файл, который будем рендерить на страницу(/cat?id=2 или cat?id=1), 2) ОБЪЕКТ -с двумя ключами 
        res.render('cat.pug', {
                               cat: values[0], //  Ключу  cat - присваиваем МАССИВ-Объектов (стр.294-302) - скоторым будем работать в cat.pug и card.pug.
                               goods: values[1] //  Ключу  goods - присваиваем МАССИВ-Объектов (стр.306-313) - скоторым будем работать в cat.pug и card.pug.
                              }
        );
      })
      .catch(error => {
        console.error(error); // Если хотя бы один промис из переданного массива завершится с ошибкой, то Promise.all() тоже завершится с этой ошибкой. 
     });
});


//__________________________ Возвращаем ф-л: views/goods.pug ___________________________

app.get('/goods', (req, res)=> { // На странице Ноутбуки (http://localhost:3000/cat?id=1)-> кликаем в карточку Первого товара Asus Vivo Book ) -> получаем Путь: http://localhost:3000/goods?id=1 (см. card.pug стр.6)
                              
  console.log(req.method); // GET

  // Импортируем модуль url ИЗ Node.js - для работы с ОБЪЕКТОМ Url (стр. 10);
  console.log(req.url); // Путь: /goods?id=1 (стр.357, 358)

  let urlRequest = url.parse(req.url, true); //  для URL: http://localhost:3000/goods?id=1
  //   console.log(urlRequest);
  
  //   Url { protocol: null, slashes: null, auth: null, host: null, port: null, hostname: null, ash: null,
  //                                    search: '?id=1',
  
  //                                    query: [Object: null prototype] { id: '1' },
  
  //                                     pathname: '/goods',
  //                                     path: '/goods?id=1',
  //                                     href: '/goods?id=1' }

  console.log(req.query.id); // 1 - стр.330; 343 
  let goodsId = req.query.id;

  console.log(`Произведен ${req.method}-запрос на СЕРВЕР http://localhost:3000/goods?id=${goodsId}`); 

  // Реализуем ЗАПРОС к Таблице goods БД - lite_shop - подключена стр. 86-93

  //   1) Создаем СТРОКУ ЗАПРОСА   [queryString - Дословно СТРОКА ЗАПРОСА]
  let queryString_4 = `SELECT * FROM goods WHERE id=${goodsId}`; // Выбрать Строку, где есть id=1

  //   2) Связываемся с БД - через const connection - которая описывает соединение с БД (стр. 86) и Метод - query()
  
  connection.query(queryString_4, (err, result) =>{
  //            СТРОКА ЗАПРОСА,  ошибка, результат
  //  console.log(err); если НЕТ ОШИБКИ - null

  //  console.log(result); // Массив-одного Объекта

  //     [
  //       {
  //         id: 1,
  //         name: 'Asus VivoBook D540NA-GQ211T',
  //         description: 'Екран 15.6" (1366x768) WXGA HD,...,
  //         cost: 7999,
  //         image: 'asus_d540na_gq211t_images_10642535768.jpg',
  //         category: 1
  //       }
  //     ]

  // Таким образом Кликнув в любую карточку товара (т.е. передав в Путь любой id - напр. http://localhost:3000/goods?id=15) - мы получим Массив-одного Объекта с соответствующим id:15

    // в Метод render() -> Передаем 1) файл, который будем рендерить на страницу(goods.pug), 2) ОБЪЕКТ - с Ключем goods 
        res.render('goods.pug', { goods: result } );
                      //  Ключу  goods - присваиваем МАССИВ-одного Объекта (стр.367-376) - скоторым будем работать в goods.pug 
        
  });
});


// Весь код запроса (стр. 416-442) к Таблице category и вывод данных - можно было-бы реализовать через Метод - GET (вообще без кода, прописанного в nav.js), но тогда [ { id: 1, category: 'Ноутбуки' }, { id: 2, category: 'Телефоны' } ] - можно было бы получить, только по url: http://localhost:3000/get-category-list. А нам необходимо чтобы пререйдя к любому товару - например:    http://localhost:3000/goods?id=10 -> На странице F12 -> Netvork - увидеть ВНУТРИ список:

//         goods?id=10
//         mustard-ui.min.css
//         style.css
//         nav.js
//         samsung.jpg
//         get-category-list -> Кликаем -> Headers: Request URL: http://localhost:3000/get-category-list
//                                                  Request Method: POST

//                                         Preview:  [ { id: 1, category: 'Ноутбуки' }, { id: 2, category: 'Телефоны' } ]
//                                         Response:  [ { "id": 1, "category": "Ноутбуки" }, { "id": 2, "category": "Телефоны" } ]

// Формально ВНУТРЬ GET-запроса (для доступа к указанной странице http://localhost:3000/goods?id=10; для чтения данных сервера) -> необходимо ПОМЕСТИТЬ Массив-ОБЪЕКТОВ [ { id: 1, category: 'Ноутбуки' }, { id: 2, category: 'Телефоны' } ] -> c которым формально работают ПО ДРУГОМУ АДРЕССУ: http://localhost:3000/get-category-list

// Такой финт реализуется при помощи fetch(url, {method: `POST`}).then().catch() - nav.js -> который привязак ФУТЕРУ goods.pug  (footer.pug)


// ОТВЕТ СЕРВЕРА НА POST-ЗАПРОС (прописанный в  nav.js) -> РЕАЛИЗОВАН стр. 416-442
// ______________________________________________________________________________________________________

// ПО УМОЛЧАНИЮ (без описаааного выше финта) - POST — метод для отправки данных в БАЗУ ДАННЫХ (на сервер) - с помощью ФОРМ.

// ТЕЛО ЗАПРОСА — это информация, которую передал браузер при запросе страницы. Но ТЕЛО ЗАПРОСА присутствует ТОЛЬКО если браузер запросил страницу методом POST. Например, если отправлена форма, то телом запроса будет содержание формы.
// ____________________________________________

// В данном случае мы НИЧЕГО НЕ ПОСЫЛАЕМ НА СЕРВЕР - мы просто просим Выбрать id И category ИЗ Таблици category (стр. 426)

app.post(`/get-category-list`, (req, res)=>{ 

  console.log(`Произведен ${req.method}-запрос - прописанный в ф-ле nav.js - на СЕРВЕР http://localhost:3000/get-category-list`); 

  // console.log(req); // Вернет ОГРОМНЫЙ ОБЪЕКТ С ДАННЫМИ СВОРМИРОВАННОГО ЗАПРОСА НА СЕРВЕР
  
  console.log(req.body); // Вернет ОБЪЕКТ - ТЕЛА Запроса (только в методе POST !!!)- если в Тело не сформировано - то вернет - {}
                        //  Если не прописать Middleware- стр.63;70 - то В ЛЮБОМ СЛУЧАЕ БУДЕТ - undefined !!!

  //   1) Создаем СТРОКУ ЗАПРОСА   [queryString - Дословно СТРОКА ЗАПРОСА]
  let queryString_5 = `SELECT id, category FROM category`; // Выбрать id И category ИЗ Таблици category

  //   2) Связываемся с БД - через const connection - которая описывает соединение с БД (стр. 86) и Метод - query()
  
  connection.query(queryString_5, (err, result) =>{
  //            СТРОКА ЗАПРОСА,  ошибка, результат
  //  console.log(err); если НЕТ ОШИБКИ - null

    console.log(result); // Массив-Объектов:  F12 -> Netvork->get-category-list->Preview 

  //     [ { id: 1, category: 'Ноутбуки' },
  //       { id: 2, category: 'Телефоны' } ]

  // в Ответ -> Передаем Массив-JSON-строк: F12 -> Netvork->get-category-list->Rerponse 
        res.json(result); //   [ { "id": 1, "category": "Ноутбуки" }, { "id": 2, "category": "Телефоны" } ]
  });
});


//__________________________________________  КОРЗИНА ___________________________________


// Весь код запроса (стр. 496-579) к Таблице goods и вывод данных - можно было-бы реализовать через Метод - GET (вообще без кода, прописанного в card.js) только по url: http://localhost:3000/get-goods-info. А нам необходимо чтобы, например,на странице http://localhost:3000/cat?id=2 - кликая по кнопкам "В КОРЗИНУ" на 1 и 2 Телефонах (с id = 10 и id = 11) в терминале получить: 

//             { key: [ '10', '11' ] }
//                                      [ '10', '11' ]
//          {
//            10: {
//                 id: 10,
//                 name: 'Samsung Galaxy M20 4/64GB Ocean Blue (SM-M205FZBWSEK)',
//                 cost: 6199.35
//                 },
//            11: {
//                id: 11,
//                name: 'Samsung Galaxy S10 8/128 GB Black (SM-G973FZKDSEK)',
//                cost: 29999.63
//                }
//          }

// Пререйдя на странице  -> F12 -> Netvork - увидеть ВНУТРИ список:

//         cat?id=2
//         mustard-ui.min.css
//         style.css
//         card.js
//         samsung_galaxy_m20.jpg
//         samsung_galaxy_s10.jpg
//         get-goods-info -> Кликаем -> Headers: Request URL: http://localhost:3000/get-goods-info
//                                               Request Method: POST

//        Preview:    {10: { {id: 10, name: "Samsung Galaxy M20 4/64GB Ocean Blue (SM-M205FZBWSEK)", cost: 6199.35} }, 11: { id: 11, name: "Samsung Galaxy S10 8/128 GB Black (SM-G973FZKDSEK)", cost: 29999.63 } }

//       Response:    { "10": { {id: 10, name: "Samsung Galaxy M20 4/64GB Ocean Blue (SM-M205FZBWSEK)", cost: 6199.35} }, "11": { id: 11, name: "Samsung Galaxy S10 8/128 GB Black (SM-G973FZKDSEK)", cost: 29999.63 } }

// Формально ВНУТРЬ GET-запроса (для доступа к указанной странице http://localhost:3000/cat?id=2 ; для чтения данных сервера) -> необходимо ПОМЕСТИТЬ ОБЪЕКТ {"10": { id: 10, name: "Samsung ..., cost: 6199.35}, "11": {  id: 11, name: "Samsung Galaxy S10 .., cost: 29999.63 } } -> c которым формально работают ПО ДРУГОМУ АДРЕССУ: http://localhost:3000/get-goods-info.

// Такой финт реализуется при помощи fetch(url, {method: `POST`, body: JSON.stringify({key: Object.keys(cart)}),}).then().catch() - card.js -> который привязак ФУТЕРУ goods.pug (footer.pug)


// ОТВЕТ СЕРВЕРА НА POST-ЗАПРОС (прописанный в card.js) -> РЕАЛИЗОВАН стр. 496-579
// ______________________________________________________________________________________________________

// ПО УМОЛЧАНИЮ (без описаааного выше финта) - POST — метод для отправки данных в БАЗУ ДАННЫХ (на сервер) - с помощью ФОРМ.

// ТЕЛО ЗАПРОСА — это информация, которую передал браузер при запросе страницы. Но ТЕЛО ЗАПРОСА присутствует ТОЛЬКО если браузер запросил страницу методом POST. Например, если отправлена форма, то телом запроса будет содержание формы.
// ____________________________________________

// В данном случае мы НИЧЕГО НЕ ПОСЫЛАЕМ НА СЕРВЕР - мы просим показать ЗНАЧЕНИЯ ключей (стр 511)- прописанных в ТЕЛЕ POST-ЗАПРОСА (card.js; стр.124), которые являются id-выбранного товаа; И на основе полученных id  - Выбрать id, name, cost  ИЗ Таблици goods (стр. 521)


app.post(`/get-goods-info`, (req, res)=>{ 

  if (req.body.key.length != 0) { // ПОЧЕМУ Проверка (if) - см. card.js - cтр.262

    console.log(`Произведен ${req.method}-запрос - прописанный в ф-ле card.js - на СЕРВЕР http://localhost:3000/get-goods-info`); 

    // console.log(req); // Вернет ОГРОМНЫЙ ОБЪЕКТ С ДАННЫМИ СВОРМИРОВАННОГО ЗАПРОСА НА СЕРВЕР
    
    console.log(req.body); // Вернет ОБЪЕКТ - ТЕЛА Запроса - прописанный в card.js стр. 124 - {{ key: [ '10', '11' ] }}
  
    // При нажатии "В КОРЗИНУ" на странице с телефонами (http://localhost:3000/cat?id=2) - 1 и 2 телефонах - вернет:
    //                       {{ key: [ '10', '11' ] }}
                          
    //  Если не прописать Middleware- стр.70 - то В ЛЮБОМ СЛУЧАЕ БУДЕТ - undefined !!!
  
    console.log(req.body.key); // [ '10', '11' ]
  
    //   1) Создаем СТРОКУ ЗАПРОСА   [queryString - Дословно СТРОКА ЗАПРОСА] - Выбрать id, name, cost  ИЗ Таблици goods - по товарам У КОТОРЫХ id = 10; id = 11 (A ЭТО - req.body.key - стр. 511)
  
    //                SELECT id, name, cost FROM goods WHERE id IN (10, 11)  - см. MySQL-DB.html стр.299  
  
    //  Теперь нам нужно переформатировать Массив [ '10', '11' ] в -> Строку (10, 11)
  
    // МЕТОД arr.join() - ОБЪЕДИНЯЕТ все элементы массива В ОДНУ СТОРОКУ - ЧЕРЕЗ ЗАПЯТУЮ. см. learn_by_heart.html стр.983-1003
  
    let queryString_6 = `SELECT id, name, cost FROM goods WHERE id IN (${req.body.key.join()})`; 
  
  
    //   2) Связываемся с БД - через const connection - которая описывает соединение с БД (стр. 86) и Метод - query()
    
    connection.query(queryString_6, (err, result) =>{
    //            СТРОКА ЗАПРОСА,  ошибка, результат
    //  console.log(err); если НЕТ ОШИБКИ - null
  
    //  console.log(result);
  
    //          [                      МАССИВ - ОБЪЕКТОВ
    //            {
    //              id: 10,
    //              name: 'Samsung Galaxy M20 4/64GB Ocean Blue (SM-M205FZBWSEK)',
    //              cost: 6199.35
    //            },
    //            {
    //              id: 11,
    //              name: 'Samsung Galaxy S10 8/128 GB Black (SM-G973FZKDSEK)',
    //              cost: 29999.63
    //            }
    //          ]
    // _____________________________________________________________________________
    
    // Но мы хотим произвести Трансвормацию Массва Объектов(result) в => OБЪЕКТ(goods) в формате Ключ(id) - Значение(Объект) т.е. что бы было:
    //     { 
    //       "10": { id: 10, name: "Samsung ..., cost: 6199.35 }, 
    //       "11": { id: 11, name: "Samsung Galaxy S10 ..., cost: 29999.63}
    //     }
  
      let goods = {}
  
    // НАПОЛНЯЕМ ОБЪЕКТ goods (вручную):  goods[`name`] = `Sergii`; => Объект goods будет иметь вид {name: `Sergii`}
    
    // Cделаем это в цикле:
  
      for (let i = 0; i < result.length; i++) {
        goods[result[i][`id`]] = result[i] // см. Наработки.html стр. 556-573
      };
  
      console.log(goods); // см. 547-550
  
    // Преобразованный Объект goods:  F12 -> Netvork->get-goods-info->Preview 
  
    //     {
    //      10: { id: 10, name: "Samsung ..., cost: 6199.35 }, 
    //      11: {  id: 11, name: "Samsung Galaxy S10 ..., cost: 29999.63}
    //       }
  
    // в Ответ -> Передаем Массив-JSON-строк: F12 -> Netvork->get-goods-info->Rerponse 
          res.json(goods);  //     { 10: { id: 10, name: "Samsung ..., cost: 6199.35 }, 
                             //      11: {  id: 11, name: "Samsung Galaxy S10 ..., cost: 29999.63} }
    });
    
  } else { // если у нас при Многократном нажатии на "-" образовывается ПУСТОЙ МАССИВ из (req.body.key); - [ ]; cтр. 511
    res.send(`0`); // в Ответ -> Отрисовываем "НОЛЬ": F12 -> Netvork->get-goods-info->Rerponse 
  };
});



//__________________________ Возвращаем ф-л: views/index.pug (Главная Страница)___________________________

// На странице выводим - 1) названия "НОУТБУКИ" и "ТЕЛЕФОНЫ" - из Таблици-category (БД-lite_shop)
//                       2) ПО ТРИ ПОСЛЕДНИХ ВНЕСЕННЫХ В таблицу - Ноутбука и Телефона - из Таблици-goods (БД-lite_shop)

// Если мыисспользуем ОДНОВРЕМЕННО 2 АССИНХРОННЫХ ЗАПРОСА В РАЗНЫЕ ТАБЛИЦИ БД - Метод Promise.all([])


app.get('/', (req, res)=> { //http://localhost:3000/ (Выбираем только Ноутбуки)
 
  console.log(`Произведен ${req.method}-запрос на СЕРВЕР http://localhost:3000/`); 

  // Реализуем ЗАПРОС к Таблицам 1) category и 2) goods; БД - lite_shop - подключена (cтр. 91)
  // Реализация запроса - через Promise (разбитого на 2 части) - см. наработки.html - стр.1284-1375

  // Создаем ПРОМИС - для выборки из таблици goods
  let promiseThreeLastGoods = new Promise(function (resolve, reject) {
    //                     Создаем SQL-ЗАПРОСЫ в БД MySQL (см. MySQL-DB.html -cтр. 45-315)

    //   1) Создаем СТРОКУ ЗАПРОСА   [queryString - Дословно СТРОКА ЗАПРОСА]

    // Выбрать ПО ТРИ ПОСЛЕДНИХ ВНЕСЕННЫХ В таблицу goods - Ноутбука и Телефона

      let queryString = `select id,name, cost, image, category from (select id,name,cost,image,category, if(if(@curr_category != category, @curr_category := category, '') != '', @k := 0, @k := @k + 1) as ind   from goods, ( select @curr_category := '' ) v ) goods where ind < 3`; 

    //   2) Связываемся с БД - через const connection - которая описывает соединение с БД (cтр.86) и Метод - query()

      connection.query(queryString, (err, result) =>{
        //          СТРОКА ЗАПРОСА,  ошибка, результат  - Массив-Объектов стр.643-653
        // if (err) reject(err);
        resolve(result); //в выполнение Ф-ЦИИ resolve()  - ПОМЕЩАЕМ (Прочитать тело ответа (body: (...)) как Массив-Объектов)
       });
    }); 


    // Создаем ПРОМИС promiseCat - для выборки из таблици category
    let promiseCat = new Promise(function (resolve, reject) {
     //                     Создаем SQL-ЗАПРОСЫ в БД MySQL (см. MySQL-DB.html -cтр. 45-315)

     //   1) Создаем СТРОКУ ЗАПРОСА   [queryString - Дословно СТРОКА ЗАПРОСА]
      let queryString = `SELECT * FROM category`; // Выьрать ВСЕ из Табл category

      //   2) Связываемся с БД - через const connection - которая описывает соединение с БД (cтр.86) и Метод - query()

        connection.query(queryString, (err, result) =>{
          //          СТРОКА ЗАПРОСА,  ошибка, результат  - Массив-Объектов стр.657-660
          // if (err) reject(err);
          resolve(result); //в выполнение Ф-ЦИИ resolve()  - ПОМЕЩАЕМ (Прочитать тело ответа (body: (...)) как Массив-Объектов)
        });
     });

      

      //  Метод Promise.all()  -  возвращает МАССИВ значений всех переданных промисов, при этом СОХРАНЯЯ ПОРЯДОК ОРИГИНАЛЬНОГО (переданного) МАССИВА, но не порядок выполнения. -  https://doka.guide/js/promise-all/

      Promise.all([promiseThreeLastGoods, promiseCat]) // ВЫПОЛНЯЕМ ОБА созданных Промиса -> Выдаем  МАССИВ ВСЕХ данных по обеим запросам
      .then(function (values) {

        // console.log(values[0]); 

        //    [  В Таблице goods - будут выбраны товары с id =1=2=3 (Три последних вневенных в таблицу НОУТБУКА) 
        //                         и товары с id =10=11=12 (Три последних вневенных в таблицу ТЕЛЕФОНА) (стр.606)

        //      { id: 1, name: 'Asus VivoBook', cost: 7999.15, image: 'asus_d540.jpg', category: 1},
        //      { id: 2, name: 'Ноутбук Lenovo IdeaPad 330-15AST', cost: 6499.2, image: 'lenovo88.jpg', category: 1},
        //      { id: 3, name: 'Ноутбук Dell Inspiron 3573', cost: 6299.45, image: 'copy_dell_in.jpg',  category: 1},

        //     { id: 10, name: 'Samsung Galaxy M20', cost: 6199.35, image: 'samsung_gal.jpg', category: 2},
        //      { id: 11, name: 'Samsung Galaxy S10', cost: 29999.63, image:  'samsung_galax.jpg', category: 2},
        //      { id: 12, name: 'Huawei P', cost: 6999.38, image: 'huawei_p.jpg', category: 2}
        //    ]

        // console.log(values[1]);

        //    [  Выбрана ВСЯ таблица - category - (стр.623)
        //      { id: 1, category: 'Ноутбуки', description: 'Так же, как и гаджеты ноутбук..', image: '114290.120x150.jpg'},
        //      { id: 2, category: 'Телефоны', description: 'Разнообразные смартфоны...', image: '75093.120x150.jpg'}
        //    ]

        // в Метод render() -> Передаем 1) файл-index.pug, который будем рендерить на страницу(http://localhost:3000/), 2) ОБЪЕКТ -с двумя ключами - значениями
        res.render('index.pug', {
                               goods: values[0], //  Ключу  goods - присваиваем (Значение) -> МАССИВ-Объектов (стр.646-653) - с которым будем работать в index.pug.
                               cat: values[1] //  Ключу  cat - присваиваем (Значение) -> МАССИВ-Объектов (стр.657-660) - с которым будем работать в index.pug.
                              }
        );
      })
      .catch(error => {
        console.error(error); // Если хотя бы один промис из переданного массива завершится с ошибкой, то Promise.all() тоже завершится с этой ошибкой. 
    });
});


//__________________________ Возвращаем ф-л: views/order.pug  (Cтраница Форма-ЗАКАЗА)___________________________

app.get('/order', (req, res)=> { // http://localhost:3000/order
                              
 console.log(`Произведен ${req.method}-запрос на СЕРВЕР http://localhost:3000/order`); 

    // в Метод render() -> Передаем 1) файл, который будем рендерить на страницу(order.pug) 
        res.render('order-form.pug');
});


// Отправка ЗАКАЗА - "КУПИТЬ" -> ОТВЕТ СЕРВЕРА НА POST-ЗАПРОС (прописанный в order.js) -> РЕАЛИЗОВАН стр. 697-776
// ______________________________________________________________________________________________________

// ПО УМОЛЧАНИЮ (без описаааного выше финта) - POST — метод для отправки данных в БАЗУ ДАННЫХ (на сервер) - с помощью ФОРМ.

// ТЕЛО ЗАПРОСА — это информация, которую передал браузер при запросе страницы. Но ТЕЛО ЗАПРОСА присутствует ТОЛЬКО если браузер запросил страницу методом POST. Например, если отправлена форма, то телом запроса будет содержание формы.
// ____________________________________________

// В данном случае мы НИЧЕГО НЕ ПОСЫЛАЕМ НА СЕРВЕР - мы просим показать ТЕЛО ЗАПРОСА (стр 703) и ЗНАЧЕНИЯ ключа-key (стр 715)- прописанных в ТЕЛЕ POST-ЗАПРОСА (order.js; стр.58-65) а также Результат запроса к Таблице-goods БД (стр 744) и выполнить отправку данных на ПОЧТУ (стр 768)


app.post(`/finish-order`, (req, res)=>{ 

    console.log(`Произведен ${req.method}-запрос - прописанный в ф-ле order.js - на СЕРВЕР http://localhost:3000/finish-order`); 

    // console.log(req); // Вернет ОГРОМНЫЙ ОБЪЕКТ С ДАННЫМИ СВОРМИРОВАННОГО ЗАПРОСА НА СЕРВЕР
    
    console.log(req.body); // Вернет ОБЪЕКТ - ТЕЛА Запроса - прописанный в order.js стр. 58-65
  
    //                 {
    //                  username: 'Сергей',
    //                  phone: '+380636066925',
    //                  email: 'Sergey.pedko123@gmail.com',
    //                  address: 'киев',
    //                   key: { '10': 1, '11': 1 } -  Если в "КОРЗИНЕ" лежат 1-шт. Телефон с id = 10 и 1-шт. Телефон с  id = 11)
    //                 }
                          
    //  Если не прописать Middleware- стр.70 - то В ЛЮБОМ СЛУЧАЕ БУДЕТ - undefined !!!
  
    console.log(req.body.key); // { '10': 1, '11': 1 } - Объект

    let arrCartGoodsId = Object.keys(req.body.key);
    // Метод Object.keys() -  Возвращает МАССИВ из Свойств(КЛЮЧЕЙ)  - Переданного ОБЕКТА, в том же порядке, в котором они бы обходились циклом for...in. 
    console.log(arrCartGoodsId); // [ '10', '11' ]

    // ____________________________________________________________________________

    // Теперь мы можем сделать Проверку - на то, что "КОРЗИНА" НЕ ПУСТА !!! (т.к. св-во length - применяется только к МАССИВАМ)

    if (arrCartGoodsId.length != 0) {

      //   1) Создаем СТРОКУ ЗАПРОСА   [queryString - Дословно СТРОКА ЗАПРОСА] - Выбрать id, name, cost  ИЗ Таблици goods - по товарам У КОТОРЫХ id = 10; id = 11 (A ЭТО - arrCartGoodsId - стр. 717; 719)
  
      //                SELECT id, name, cost FROM goods WHERE id IN (10, 11)  - см. MySQL-DB.html стр.299  
  
      //  Теперь нам нужно переформатировать Массив [ '10', '11' ] в -> Строку (10, 11)
  
      // МЕТОД arr.join() - ОБЪЕДИНЯЕТ все элементы массива В ОДНУ СТОРОКУ - ЧЕРЕЗ ЗАПЯТУЮ. см. learn_by_heart.html стр.983-1003
  
      let queryString = `SELECT id, name, cost FROM goods WHERE id IN (${arrCartGoodsId.join()})`; 
  
  
      //   2) Связываемся с БД - через const connection - которая описывает соединение с БД (стр. 86) и Метод - query()
    
      connection.query(queryString, (err, result) =>{
          //            СТРОКА ЗАПРОСА,  ошибка, результат
          //  console.log(err); если НЕТ ОШИБКИ - null
      
            console.log(result);
      
          //          [                      МАССИВ - ОБЪЕКТОВ
          //            {
          //              id: 10,
          //              name: 'Samsung Galaxy M20 4/64GB Ocean Blue (SM-M205FZBWSEK)',
          //              cost: 6199.35
          //            },
          //            {
          //              id: 11,
          //              name: 'Samsung Galaxy S10 8/128 GB Black (SM-G973FZKDSEK)',
          //              cost: 29999.63
          //            }
          //          ]
          // _____________________________________________________________________________

          //    res.send(result);  -  Ответ сервера на POSt-Запрос-> Отрисовываем: МАССИВ - ОБЪЕКТОВ -стр.746-757: F12 -> Netvork->finish-order->Rerponse 
          // _____________________________________________________________________________


          // Теперь все это необходимо ОТОСЛАТЬ НА ПОЧТУ - исспользуя Модуль NODEMAILER(стр.12) -> Пропишем ВЫЗОВ Ф-Ции

          //      orderMail(req.body, result).catch(console.error);  --- catch() - если отправка Почты - НЕ произойдет -> Будет выведена ОШИБКА! (можно и не прописывать!!!)

          orderMail(req.body, result);

          res.send(`1`); // Ответ сервера (ОБЯЗАТЕЛЬНО - "СТРОКА") на POSt-Запрос-> Отрисовываем - вручную: `1`: F12 -> Netvork->finish-order->Rerponse (в order.js - выполняется УСЛОВИЕ - стр.96-104)
      });
      
    } else {
      res.send(`0`); //  Если КОРЗИНА ПУСТА (ДЛИННА МАССИВА = 0)-> Ответ сервера (ОБЯЗАТЕЛЬНО - "СТРОКА") на POSt-Запрос-> Отрисовываем - вручную: `0`: F12 -> Netvork->finish-order->Rerponse  (в order.js - выполняется УСЛОВИЕ - стр.108-114)
    }; 
});
// ________________________________________________________________

// Пропишем Ф-цию - которая отсылает Данные НА ПОЧТУ (исспользуя Модуль NODEMAILER-стр.12)
async function orderMail(data, result) {
  // data - (req.body) - все ТЕЛО POST-Запроса - стр. 705-711; result - выборка из таюлици-goods БД-товаров, которые отложены в "КОРЗИНУ" - стр. 746-757

  // Формируем текст Письма в ФОРМАТЕ html:____________________________________________________________________

  let mailText = `<h2>Ваш заказ товаров из магазина Lite Shop</h2>`

  let total = 0; // Высчитаем сколько денег ВСЕГО по заказу

  for (let i = 0; i < result.length; i++) { // Перебираем данные МАССИВА-объектов(result стр.746-757)
    
    mailText = mailText + `<p> ${result[i][`name`]} - ${data.key[result[i][`id`]]} шт. - ${result[i][`cost`] * data.key[result[i][`id`]]} грн.</p>`;

    total = total + result[i][`cost`] * data.key[result[i][`id`]];
  };

  mailText = mailText + `<hr>`; // Горизонтальная- разднляющая линия

  mailText = mailText + `<p> Всего к оплате: ${total} грн.</p>`;

  mailText = mailText + `<hr>`; // Горизонтальная- разднляющая линия

  // В письме после всех данных о товарах - Формируем данные Покупателя из заполненной Ф-мы _____________________

  mailText = mailText + `<p> ${data[`username`]} </p>`;
  mailText = mailText + `<p> ${data[`phone`]} </p>`;
  mailText = mailText + `<p> ${data[`email`]} </p>`;
  mailText = mailText + `<p> ${data[`address`]} </p>`;

  console.log(mailText);

  //__________ Посылаем письмо исспользуя Почтовый сервис - Nodemailer: https://nodemailer.com/about/ ________________

  // Cоздаем ТЕСТОВЫЙ Account - скопировано из Example (Nodemailer)

  let testAccount = await nodemailer.createTestAccount();

  // Настройка ТЕСТОВОГО Account -> НА НОСТИНГЕ эти НАСТРОЙКИ - БУДУТ ПЕРЕПИСАНЫ (в соответствии с ПАРАМЕТРАМИ ХОСТИНГА)
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // CГЕНЕРИРОВАННЫЕ Nodemailer - данные пользователя
      pass: testAccount.pass // CГЕНЕРИРОВАННЫЕ Nodemailer - данные пользователя
    }
  });

  // Настройка ПИСЬМА - так называемые Mail Options

  let mailOptons = {
    from: '<Sergey.pedko123@gmail.com>', // Email - самого магазина Lite Shop (Email - ХОСТИНГА)
    to: "Sergey.pedko123@gmail.com," + data[`email`], // Email получателей: Менеджера магазина и того, кто заполнял Ф-му
    subject: "Ваш заказ в магазине Lite Shop ✔", // Subject line
    text: "Вы сделали ЗАКАЗ в нашем Интернет-магазине. Для уточнения деталей позвоните нашему Менеджеру: 063-60-66-925", // Упрощенная версия заказа (иногда почтовые сервисы НЕ ПОНИМАЮТ сообщения в виде html-кода стр.785-807)

    html: mailText // Передаем Сформированный в ФОРМАТЕ html (стр.785-807) ТЕКСТ ПИСЬМА
  };

  // Отправка Письма - по заданным mailOptons
  let info = await transporter.sendMail(mailOptons);


  console.log("Message sent: %s", info.messageId); // Объект info разную информацию об отправленной почте                      (мы вынимаем - id -сообщения)
  // Message sent: <9500dbc6-e5c1-6d9d-771a-b75ec880083b@gmail.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/ZCQ3B-KaqoBz36sKZCQ3CKD91CXnfYcEAAAAAY3e-vpEN70wKl6T8q03E0w

  // Копируем этот URL и вставляем в адрессную строку браузера - ЗДЕСЬ МОЖНО УВИДЕТЬ ОТПРАВЛЕННОЕ (Тестовое) ПИСЬМО !!!

  // При отправке каждого нового письма - Node.js - будет выдавать НОВЫЕ параметры Message sent (стр. 844) и  Preview URL (стр. 848) - поэтому: Копируем каждый раз новый URL (который сгенерирует Node.js) и вставляем в адрессную строку браузера чтобы - УВИДЕТЬ НОВОЕ ОТПРАВЛЕННОЕ (Тестовое) ПИСЬМО !!!
  // _______________________________________________________________________________

  console.log(`Ф-ция sendMail() - сработала. Email отправлен !`);

  // return true; (данное выражение ВСЕГДА прерывает выполнение функции  - как и return; return true; return false; return x; return x + y / 3;) Оператор return завершает выполнение текущей функции и возвращает её значение.
};
// ______________________________________________________________________________________________________