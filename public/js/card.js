console.log(`Подключили файл card.js к footer.pug !!!`);

//1)  КОРЗИНА  - будет представлять собой ОБЪЕКТ, который будет наполняться - стр. 90-94

// 2) Каждая КНОПКА - "В КОРЗИНУ" - например: <button class="add-to-cart" data-goods_id="8">в Корзину</button> ИМЕЕТ:

//    Один из Классов: add-to-cart
//            Атрибут: data-goods_id="8" (id Товара - в Таблице - goods; БД-lite_shop)

// data - атрибут  -  применяется для задания каких-то Данных напямую в элемент HTML - которые могут в последующем быть обработаны в JS - см. interview.html стр. 713-784

let cart = {}; // Объект - КОРЗИНА

//  querySelectorAll - Возвращает СПИСОК ЭЛЕМЕНТОВ - NodeList (КАК ПСЕВДОМАССИВ) применяем МЕТОД ПЕРЕБОРА ЭЛЕМЕНТОВ МАССИВА - for или arr.forEach()
let btnArr = document.querySelectorAll(`.add-to-cart`);

console.log(btnArr); // Для страници http://localhost:3000/cat?id=2  - ТЕЛЕФОНЫ:

// NodeList(6) [...] - возвращаем ВСЕ кнопки - "В КОРЗИНУ" на Странице
//              0 : button.button.button-primary.add-to-cart
//              .... 
//              5 : button.button.button-primary.add-to-cart

btnArr.forEach((element) => {
  console.log(element); // Проверочка

  element.onclick = addToCart; // По клику на любую КНОПКУ - "В КОРЗИНУ"  - выполнится Ф-ция addToCart;

});


// Перед добавлением товаров в Корзину - необходимо проверить - что было загружено в Корзину РАНЕЕ???? - вытащить данные из localStorage (стр.273-277) в Объект сart  (Наработки.html стр. 976-1011)

if (localStorage.getItem(`Корзина`) !== null) { // Извекаем данные из localStorage по Ключу `Корзина` - если там что-то есть (localStorage - НЕ ПУСТОЙ)

  cart = JSON.parse(localStorage.getItem(`Корзина`)); // Превращаем JSON.строку(которая находится в localStorage) в -> Object и присваиваем эти данные Объекту cart

  getGoodsInfo() // Заново отрисовываем корзину т.к. КОЛ-ВО товара ИЗМЕНИЛОСЬ - см.стр. 115-171 - ВИЗУАЛИЗАЦИЯ Корзины

};
// Просмотр localStorage: F12-> Application

// ______________________________________________________________

function addToCart() { //Добавляем данные в КОРЗИНУ
  let goodsId = this.dataset.goods_id

  // event.target –   это "ЦЕЛЕВОЙ ЭЛЕМЕНТ» элемент, НА КОТОРОМ ПРОИЗОШЛО СОБЫТИЕ, в процессе всплытия он неизменен.
  
  // this – ЭТО «текущий элемент", ДО КОТОРОГО ДОШЛО ВСПЛЫТИЕ, НА НЁМ СЕЙЧАС ВЫПОЛНЯЕТСЯ ОБРАБОТЧИК.

  // «this» - всегда УКАЗЫВАЕТ НА ОБЪЕКТ - ВЫЗЫВАЮЩИЙ Ф-ЦИЮ  - УКАЖЕТ НА ТЕГ(элемент) <button> КАЖДОЙ ОТДЕЛЬНОЙ КНОПКИ - Которая была нажата

  // dataset - значение Прописанного АТРИБУТА кнопки  - напр. data-goods_id="8"(стр. 5); БУДЕТ РАВНО = 8 (см. interview.html стр. 713-784)

  console.log(goodsId); // 8

  // ___________________________________________________________________________

  // ДОБАВЛЕНИЕ в Объект НОВОЙ ПАРЫ Ключ-Значение (Присвоение новых значений свойствам (ОБЪЕКТА-phone)) - см. НАРАБОТКИ.html стр. 413-482

  //                                        let phone = {
  //                                         Свойство(ключ)  Значение 
  //                                               key:        phone[key]
  //                                               model:       "Nokia", 
  //                                               price:        2000
  //                                         }; 

 // НАПОЛНЯЕМ ОБЪЕКТ phone:

 //                phone.country = "Sweden"; - 1 способ.(такая запись в Ф-ЦИЯХ может НЕ РАБОТАТЬ!!!) 
 //                phone["quantity"] = 25;   - 2 способ (такая запись РАБОТАЕТ в ф-циях). Обращение как к ассоциативному массиву

 //                console.log(phone); {model: 'Nokia', price: 2000, country: 'Sweden', quantity: 25}

  // _______________________________________________________________
  //  НАПОЛНЯЕМ ОБЪЕКТ cart - аналогично Объекту phone - стр. 71-72

  // 1) Теперь нам необходимо чтобы при Первом-Клике на Кнопку с data-goods_id="8" - ОБЪЕКТ cart имел вид: {8:1}
  // 2) при Втором-Клике на Кнопку с data-goods_id="8" - ОБЪЕКТ cart имел вид: {8:2}
  // 3) при дальнейшем Первом-Клике на Кнопку с data-goods_id="15" - ОБЪЕКТ cart имел вид: 
  //                                                                                   
  //                                        let cart = {
  //                                         Свойство(ключ)    Значение 
  //                                     key -> goodsId:     cart[goodsId]
  //                                                  8:       2, (cart[goodsId] = 2; т.е. cart[8] = 2)
  //                                                 15:       1  (cart[goodsId] = 1; т.е. cart[15] = 1 )
  //                                         }; 

  if (cart[goodsId] !== undefined) { //Если у объекта  cart - уже есть какое -то Значение ключа (cart[goodsId] = 1)
    cart[goodsId] = cart[goodsId] + 1; //то мы увеличим это значение на 1 (cart[goodsId] = 2) - При повторном нажатии "В КОРЗИНУ" ЭТОГО ЖЕ ТОВАРА
  } else{
    cart[goodsId] = 1; // Иначе будет введен НОВЫЙ-ключ, и мы добавим новую пару: Ключ - [Значение = 1] - При нажатии "В КОРЗИНУ" КАКОГО-ТО ДРУГОГО ТОВАРА
  };
  console.log(cart); 

  getGoodsInfo() // см.стр. 115-171 - ВИЗУАЛИЗАЦИЯ Корзины

};


// Чтобы ВИЗУАЛИЗИРОВАТЬ Корзину нам необходимо ВЫТАЩИТЬ информацию о ТОВАРЕ по его id в Таблице-goods; БД- lite_shop 

// Формально ВНУТРЬ GET-запроса (для доступа к указанной странице http://localhost:3000/cat?id=2 ; для чтения данных сервера) -> При клике на Кнопи "В КОРЗИНУ" -например на 1 и 2 ТЕЛЕФОНАХ с id = 10; id = 11 => необходимо ПОМЕСТИТЬ ОБЪЕКТ {10: { id: 10, name: "Samsung ..., cost: 6199.35}, 11: {  id: 11, name: "Samsung Galaxy S10 .., cost: 29999.63 } } -> c которым формально работают ПО ДРУГОМУ АДРЕССУ: http://localhost:3000/get-goods-info.

// Такой финт реализуется при помощи fetch(url, {method: `POST`, body: JSON.stringify({key: Object.keys(cart)}),}).then().catch() -> который привязак ФУТЕРУ goods.pug (footer.pug)


// ОТВЕТ СЕРВЕРА НА МЕТОД-POST -> РЕАЛИЗОВАН app.js стр. 496-579
// ___________________________________________________________________________
// Цепочки fetch().then().catch() - исспользуются для реализации методов GET, POST, PUT, DELETE

// Метод fetch().then().catch() - Наработки.html стр.281-346;  1249-1282

function getGoodsInfo() {

  updateLocalStorageCart(); // Перед тем как делать POST-Запрос - СОХРАНЯЕМ в localStorage данные о товарах, которые были положены в КОРЗИНУ Раньше  - стр. 273-277 

  let url = `/get-goods-info`;

  fetch(url, {
                method: `POST`, // Ответ сервера на POSt-Запрос (Метод и Роутинг) - должен быть описан в app.js - 507-590

                body: JSON.stringify({key: Object.keys(cart)}),
              // При ОТПРАВКЕ ДАННЫХ (в виде СТРОКИ - JSON.stringify() ) на Сервер - Методом POST  - формируем ТЕЛО ЗАПРОСА - body - внутрь которого помещаем ОБЪЕКТ с параметрами: Ключ(key) - Значение( Object.keys(cart) - которое берем оиз объекта cart ) -  {{ key: [ '10', '11' ] }} ;  (10  и 11 - это id - товаров по которым кликнули "В КОРЗИНУ")

              //   Метод Object.keys() -  Возвращает МАССИВ из Свойств(КЛЮЧЕЙ)  - Переданного ОБЕКТА, в том же порядке, в котором они бы обходились циклом for...in. - см.  Наработки.html стр.941-966;

                headers: {
                  "Accept": "application/json",
                  "Content-Type" : "application/json"
                } // ХЕАДЕР ОТВЕТА - возвращаем информацию о Возвращающем ТИПЕ КОНТЕНТА - JSON
             })
        //   .then((response) =>  response.json()) - без {} - return МОЖНО НЕ ПИСАТЬ !!!  
            .then((response) =>  { 
              console.log(response); // Response {type: 'basic', url: 'http://localhost:3000/get-goods-info', redirected: false, status: 200, ok: true, …}

              return response.json();
            }) //Прочитать тело запроса (body: (...)) СРАЗУ как Объект 

  // получаем тело ответа
          // _________________________________________________________________________
          //   var content = await response.text();    читает ответ и возвращает как  обычный текст - СТРОКУ! - Чтобы преобразовать ее в Object необходимо:

          //    var obj = JSON.parse(content); чтобы преобразовать в Object!!! - со всеми присущими ему методами (а НЕ - строку)
          // ________________________________________________________________________
          // Чтобы Cразу ВЕРНУТЬ Object!!! - со всеми присущими ему методами (а НЕ - JSON-СТРОКУ), минуя JSON.parse(content) - необходимо : var content = await response.json(); // вернет Object!!!


            .then((body) => {
                console.log(body); // например,на странице http://localhost:3000/cat?id=2 - кликая по кнопкам "В КОРЗИНУ" на 1 и 2 Телефонах (с id = 10 и id = 11) - после Трансформации (app.js; стр. 567-569)получим:

                //          {
                //            "10": {
                //                   id: 10,
                //                   name: 'Samsung Galaxy M20 4/64GB Ocean Blue (SM-M205FZBWSEK)',
                //                   cost: 6199.35
                //                  },
                //            "11": {
                //                   id: 11,
                //                   name: 'Samsung Galaxy S10 8/128 GB Black (SM-G973FZKDSEK)',
                //                   cost: 29999.63
                //                  }
                //          }  

                showCart(body) // Ф-ция вывода данных из ОБЪЕКТА body - стр.173-238; - в Таблицу (nav.pug)
                //                <table class="table table-striped table-cart"> 
               })

            .catch((error) => console.log(error));
};

function showCart(data) { // Данные выводим В ВИДЕ ТАБЛИЦИ (см. HTML.html стр.759-797)

  let out = `<table class="table table-striped table-cart"><tbody>`; // Открываем Основные Теги Таблици
  
  let total = 0; // Будем считать "ИТОГО" к оплате (ПО НЕСКОЛЬКИМ ТОВАРАМ)

  for (let key in cart) { // Перебираем Объект cart { 10:1, 11:1 }, который мы сформировали Нажав "В КОРЗИНУ" на товарах с id=10 и id=11 (cтр 63-81); Метод перебора ОБЪЕКТА - learn_by_heart.html стр. 1487-1529

    // Первая СТРОКА
    out = out + `<tr>
                    <td colspan="4"><a href="/goods?id=${key}">${data[key][`name`]}</a></td> 
                 </tr>`; // Название Товара

                // ВНИМАНИЕ!!! МЫ перебираем ОБЪЕКТ cart - но его Ключи -key => ПЕРЕДАЕМ В  ДРУГОЙ ОБЪЕКТ - data (body) 
                // data[key][`name`] - такой финт возможен если ОБА ОБЪЕКТА СОДЕРЖАТ ЦИФРОВЫЕ КЛЮЧИ (стр. 179; 154; 159)

    // Вторая СТРОКА
    out = out + `<tr>
                    <td><i class="far fa-minus-square cart-minus" data-goods_id="${key}"></i></td>`; // Кнопка "МИНУС"

    out = out + `<td>${cart[key]}</td>`; // Количество ВЫБРАННОЙ ЕДЕНИЦИ ТОВАРА (cколько раз кликнули "В КОРИНУ

    out = out + `<td><i class="far fa-plus-square cart-plus" data-goods_id="${key}"></i></td>`; // Кнопка "ПЛЮС"

    out = out + `<td> ${(cart[key] * data[key][`cost`]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ')} грн. </td>`; // Стоимость по позиции Товара = кол-во * Цена; toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ') - Это РЕГУЛЯРНОЕ ВЫРАЖЕНИЕ, которое приводит например 6999,379898 => в 6 999.38
   //________________________________________________________________________  
    out = out + `<tr>`; //Закрываем Открытый тег ВТОРОЙ строки <tr> - стр.190


   // В цикле считаем ИТОГО к оплате = CУММА=> Кол-во товара (стр.193) * Цена товара (стр.197)
   total = total + cart[key] * data[key][`cost`];
  };

  // _____________ ПОСЛЕ ЦИКЛА !!!! ______________________

  // Третья СТРОКА
  out = out + `<tr>
                  <td colspan="3">ИТОГО к оплате</td> 
                  <td>${total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ')} грн. </td> 
              </tr>`; // Выводим ИТОГО к оплате (ОКРУГЛЕННЫЙ ДО 2 ЗНАКОВ после запятой - см.Наработки.html стр.672-693) 

  out = out + `</tbody></table>`; // Закрываем Основные Теги Таблици

  document.querySelector(`#cart-nav`).innerHTML = out; // Выводим данные НА ЭКРАН  - внутри div<id="cart-nav"> - nav.pug 
  // _____________________________________________________________________________________________

  // На ВСЕ иконки "+" (стр.195) и "-" (стр.191)- необходимо повесить СОБЫТИЕ onclick - чтобы изменять КОЛ-ВО товара В КОРЗИНЕ 
  // Эти иконки появятся в DOM - после их вывода на Экран - стр.216

  //  querySelectorAll - Возвращает СПИСОК ЭЛЕМЕНТОВ - NodeList (КАК ПСЕВДОМАССИВ) применяем МЕТОД ПЕРЕБОРА ЭЛЕМЕНТОВ МАССИВА - for или arr.forEach() - т.е. можно ВСЕМ КНОПКАМ на событие onclick повесить ВЫПОЛНЕНИЕ соответствующщей Ф-ции

  let arrBtnMinus = document.querySelectorAll(`.cart-minus`); //Все кнопки-иконки "МИНУС"

  arrBtnMinus.forEach((element)=>{
    element.onclick = cartMinus;
  });

  // то же делаем для кнопок-иконок "ПЛЮС"

  let arrBtnPlus = document.querySelectorAll(`.cart-plus`); //Все кнопки-иконки "ПЛЮС"

  arrBtnPlus.forEach((element)=>{
    element.onclick = cartPlus;
  });

};

// Напишем Ф-ции cartMinus() -стр.227 и cartPlus() - стр.235 _____________________________________

function cartPlus() { // аналогия  - стр.45-99

  let goodsId = this.dataset.goods_id //по нажатию на "+" получаем id товара (см.46-56)

   //Если товар УЖЕ в Корзине(Объект cart), то у объекта  cart - уже есть Значение ключа (cart[goodsId] = 1)

    cart[goodsId] = cart[goodsId] + 1; // Увеличиваеи это значение на 1 (cart[goodsId] = 2)

  getGoodsInfo() // Заново отрисовываем корзину т.к. КОЛ-ВО товара ИЗМЕНИЛОСЬ - см.стр. 115-171 - ВИЗУАЛИЗАЦИЯ Корзины
};

// ________________________________________________

function cartMinus() { // 1) Если КОЛ-ВО (товара в корзине) > 0, ТО его УМЕНЬШАЕМ; 2) Если КОЛ-ВО ДОСТИГЛО НУЛЯ => товарную позицию НЕОБХОДИМО УДАЛИТЬ

  let goodsId = this.dataset.goods_id //по нажатию на "-" получаем id товара (см.46-56)

  if ( cart[goodsId] -1 > 0) {
    cart[goodsId] = cart[goodsId] - 1;
  } else {
    delete cart[goodsId];  // При МНОГОКРАТНОМ нажатии на "-" чтобы ПОЛНОСТЬЮ ОЧИСТИТЬ КОРЗИНУ - СРАБАТЫВАЕТ getGoodsInfo() - стр.265 - которая отрабатывает POST-Запрос в котором есть Тело запроса -  внутрь которого помещаем ОБЪЕКТ с параметрами: Ключ(key) - Значение( Object.keys(cart) - которое берем из объекта cart ) -  {{ key: [ 'null' ] }}  - т.е. ПУСТОЙ МАССИВ []; - как резкльтат ОШИБКА - TypeError: Failed to fetch -стр.121 !!!! Для того, чтобы это исправить - необходимо сделать ПРОВЕРКУ в app.js стр. 498; 576 -> if (req.body.key.length != 0) { В ОТВЕТ(res) - возвращаем Объест - goods} else {res.send(`0`);  - в Ответ -> Отрисовываем "НОЛЬ": F12 -> Netvork->get-goods-info->Rerponse }
  };

  getGoodsInfo() // Заново отрисовываем корзину т.к. КОЛ-ВО товара ИЗМЕНИЛОСЬ - см.стр. 115-171 - ВИЗУАЛИЗАЦИЯ Корзины
};

// _________________________________________________________________________________________________

// _____Нам необходимо СОХРАНИТЬ то, что ОТПРАВЛЕНО В КОРЗИНУ В localStorage (Чтобы потом СДЕЛАТЬ ИЗМЕНЕНИЯ В БД)___

// работа с localStorage - Наработки.html стр. 976-1011
function updateLocalStorageCart() {
  localStorage.setItem(`Корзина`, JSON.stringify(cart)); // Отправля
  //  F12->Application    key             Value 
    // Просто объект cart - передать НЕЛЬЗЯ -  можно только - ПРЕОБРАЗОВАВ В СТРОКУ
};