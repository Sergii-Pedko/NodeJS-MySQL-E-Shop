console.log(`Подключили файл: nav.js к footer.pug !!!`);

// ___________________________________________________________________________________________________________________

// Формально ВНУТРЬ GET-запроса (для доступа к указанной странице http://localhost:3000/goods?id=10; для чтения данных сервера),- описанного в app.js; стр 416-442 -> необходимо ПОМЕСТИТЬ Массив-ОБЪЕКТОВ [ { id: 1, category: 'Ноутбуки' }, { id: 2, category: 'Телефоны' } ] -> c которым формально работают ПО ДРУГОМУ АДРЕССУ: http://localhost:3000/get-category-list

// Такой финт реализуется при помощи ФОРМИРОВАНИЯ POST-ЗАПРОСА НА СЕРВЕР исспользуя Метод: fetch(url, {method: `POST`}).then().catch() -> который привязак ФУТЕРУ goods.pug (footer.pug)

//  ОТВЕТ СЕРВЕРА НА POST-ЗАПРОС - прописанный здесь в nav.js -> РЕАЛИЗОВАН app.js стр. 416-442

// ПО УМОЛЧАНИЮ (без описаааного выше финта) - POST — метод для отправки данных в БАЗУ ДАННЫХ (на сайт) - с помощью ФОРМ.
// ______________________________________________________________________________________________________________________
// Цепочки fetch().then().catch() - исспользуются для реализации методов GET, POST, PUT, DELETE

// Ф-ция получения списка КАТЕГОРИЙ ТОВАРОВ: [ { id: 1, category: 'Ноутбуки' }, { id: 2, category: 'Телефоны' } ] - из Таблици category 


// Метод fetch().then().catch() - Наработки.html стр.281-346;  1249-1282

function getCategorylist() {
  let url = `/get-category-list`;

  fetch(url, {
              method: `POST` // Ответ сервера на POSt-Запрос (Метод и Роутинг) - должен быть описан в app.js - 416-442
             })
        //   .then((response) =>  response.json()) - без {} - return МОЖНО НЕ ПИСАТЬ !!!  
            .then((response) =>  { 
              console.log(response); // Response {type: 'basic', url: 'http://localhost:3000/get-category-list', redirected: false, status: 200, ok: true, …}

              return response.json();
            }) //Прочитать тело запроса (body: (...)) СРАЗУ как Объект 

  // получаем тело ответа
          // _________________________________________________________________________
          //   var content = await response.text();    читает ответ и возвращает как  обычный текст - СТРОКУ! - Чтобы преобразовать ее в Object необходимо:

          //    var obj = JSON.parse(content); чтобы преобразовать в Object!!! - со всеми присущими ему методами (а НЕ - строку)
          // ________________________________________________________________________
          // Чтобы Cразу ВЕРНУТЬ Object!!! - со всеми присущими ему методами (а НЕ - JSON-СТРОКУ), минуя JSON.parse(content) - необходимо : var content = await response.json(); // вернет Object!!!


            .then((body) => {
                console.log(body); //  Массив-ОбеКтов  [ { id: 1, category: 'Ноутбуки' }, { id: 2, category: 'Телефоны' } ]

                // showCategoryList(body); // Выполнить ф-цию - прописанную в стр.83

                  //  Метод перебора массива  forEach((element, index)=> {console.log(element}) c последующей Деструктуризацией
                  // {id, category} = element; см. Наработки.html стр. 171-234

                  body.forEach(({id, category}, index) => {
                    console.log( `id эл-та: ${id}; Категория эл-та: ${category}; Индекс Элемента - ${index}`);

                    let ul = document.querySelector(`.category-list`); // Вернем внешнюю оболочку <ul class="category-list"></ul> из nav.pug - внутрь которой ОДИН ЗА ДРУГИМ будем выводить <li>


                    console.log(ul); // проверочка 

                    // Выводим в цикле Данные на Экран

                    ul.innerHTML = ul.innerHTML + `<li>
                                                      <a href="/cat?id=${id}">${category}</a>  
                                                  </li>`;
                  });
               })

            .catch((error) => console.log(error));
};

// Вместо Метода forEach( function ({id, category}, index) {} ) - стр.50-62 => Можно исспользоват простой Цикл:

//  let out = `<ul class="category-list"><li><a href="/">Главная Страница</a></li>`;

//     for(let i = 0; i <ul data.length; i++ ) {
//       out = out + `<li> <a href="/cat?id=${data[i][`id`]}">${data[i][`category`]}</a> <li>`
//    };

//  out = out + `</ul>`; - Закрываем тег (стр.70)

//  document.querySelector(`#category-list`).innerHTML = out;  - Выводим данные на экран в Блоке <div id="category-list"></div>
// ___________________________________________________________________________________________________________________________
       

//    function showCategoryList(data) { - стр. 50- 62 МОЖНО БЫЛО ПОМЕСТИТЬ В ЭТУ Ф-ЦИЮ И ВЫЗВАТЬ ЕЕ В стр.45
//      console.log(data);
//    };


getCategorylist() //Запустили ф-цию стр.20

// __________________________________________________________________________________________


// Пропишем ф-ции Открывающие/Закрывающие МЕНЮ НАВИГАЦИИ ПО САЙТУ - div(class="site-nav button-primary") - nav.pug

//  Изначально у Блока - position:fixed; а это значит, что сдвигается Блок (Относительно Верхней-Левой точки Экрана) при помощи css-команд (top, bottom, left, right)) Ширина блока - width: 300px; Чтобы сдвинуть блок за пределы экрана влево - необходимо : left: -300px; - что и было сделано в style.css (Блок СДВИНУТ ВЛЕВО ЗА ПРЕДЕЛЫ ЭКРАНА)


// 1) Открываем  МЕНЮ НАВИГАЦИИ ПО САЙТУ - кнопкой "Бургер" слева от Lite Shop - из site_header.pug; стр.5 

let btnShow = document.querySelector(`.shov-nav`);

console.log(btnShow); // Проверочка: <button class="shov-nav"><i class="fas fa-bars"></i></button>

function showNav() {
  document.querySelector(`.site-nav`).style.cssText = `left: 0px;`;
  //  Чтобы вернуть Блок (position:fixed;) на экран необходимо изменить его св-во left: -340px; -> на left: 0px;    
};

btnShow.onclick = showNav; // Нажимаем на кнопку-> вызываем событие "onclick"-> которое выполняет ф-цию showNav()


// 2) Закрываем МЕНЮ НАВИГАЦИИ ПО САЙТУ - кнопкой "Х" - из nav.pug; стр.4 

let btnClose = document.querySelector(`.close-nav`);

console.log(btnClose); // Проверочка: <button class="button-primary-outlined close-nav"> X </button>

function closeNav() {
  document.querySelector(`.site-nav`).style.cssText = `left: -340px;`;
  //  выполнив ф-цию showNav() - мы сдвинули блок на Экран (стр.105). Чтобы снова сдвинуть блок ЗА ПРЕДЕЛЫ ЭКРАНА ВЛЕВО - необходимо изменить его св-во left: 0px; -> на  left: -340px;
};

btnClose.onclick = closeNav; // Нажимаем на кнопку-> вызываем событие "onclick"-> которое выполняет ф-цию closeNav()


