console.log(`Подключили файл - order.js к order-form.pug !!!`);

// Классически событие onsubmit (onclick) - вешается на КНОПКУ, но в нашем случае мы хотим убить 2 зайцев- отменить перезагрузку страници по нажатию на кнопку (внутри ф-мы) и обрезать пробелы во всех <input> - тоже внутри ф-мы - поэтому на событие onsubmit - вешаем ВСЮ ФОРМУ!!!  

// Получаем данные из ВСЕХ полей формы <form id="lite-shop-order" action="">  - order-form.pug

document.querySelector(`#lite-shop-order`).onsubmit = function (event){

  // По нажатию на кнопку type="submit" - происходит АВТОМАТИЧЕСКАЯ ПЕРЕЗАГРУЗКА страници - и идет отправка данных на Сервер
  // Отменим это действие - JS-DOM.html-стр.3938-3965

  event.preventDefault(); //event.preventDefault() - Ф-ЦИЯя ОТМЕНЯЮЩАЯ ДЕЙСТВИЕ ПО УМОЛЧАНИЮ для события
  //  кнопке type="submit" - ЗАПРЕЩАЕМ ОТПРАВКУ ф-мы (Это делается когда в Node.js - данные ф-мы отправляются НЕ нажатием кнопки "Submit" - а при помощи отдельного POST - запроса - cтр.53-118 
  // ___________________________________________________________________

  // метод trim() позволяет УДАЛИТЬ ПРОБЕЛЫ пробелы с обоих концов строки - во всех <input> (Можно вводить с пробелами!!!) - main.js-cтр.658; Наработки.html -cтр.919-937;

  let username = document.querySelector(`#username`).value.trim();
  let phone = document.querySelector(`#phone`).value.trim();
  let email = document.querySelector(`#email`).value.trim();
  let address = document.querySelector(`#address`).value.trim();

  // Необходимо, чтобы в checkbox - ОБЯЗАТЕЛЬНО стояла галочка____________

  if ( !document.querySelector(`#rule`).checked ) { //Если галочка НЕ СТОИТ!!!

    //  В order-form.pug - Подключен Cкрипт (стр.74) - Модальные окна-ПОДСКАЗКИ - https://sweetalert2.github.io/#download
    // Синтаксис написания - см. НА САЙТЕ - USAGE; ICONS
    Swal.fire({
      title: 'Предупреждение!',
      text: 'Необходимо СОГЛАСИТЬСЯ С УСЛОВИЯМИ и СРОКАМИ выполнения заказа',
      icon: 'warning',
      confirmButtonText: 'OK'
    });

    return false; // останавливаем выполнение кода - Ф-МА НЕ ОТПРАВИТСЯ! ( return false - аналогичен  - event.preventDefault() )
  };

  if ( username ==``|| phone ==``|| email ==``|| address ==``) { //  Логическое ИЛИ (логическое сложение) - «ЕСЛИ  хотя бы ОДИН из АРГУМЕНТОВ true, то возвращает true, иначе — false.

    // Аналогично стр.29-34
    Swal.fire({
      title: 'Предупреждение!',
      text: 'Заполните ВСЕ строки ФОРМЫ',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
    
    return false;
  };


  let url = `/finish-order`;

  fetch(url, {
                method: `POST`, // Ответ сервера на POSt-Запрос (Метод и Роутинг) - должен быть описан в app.js - 697-776

                body: JSON.stringify({
                                      "username": username,
                                      "phone": phone,
                                      "email": email,
                                      "address": address,

                                      "key": JSON.parse(localStorage.getItem(`Корзина`)) // Превращаем JSON.строку(которая находится в localStorage) в -> Object
                                    }),
              // При ОТПРАВКЕ ДАННЫХ (в виде СТРОКИ - JSON.stringify() ) на Сервер - Методом POST  - формируем ТЕЛО ЗАПРОСА - body - внутрь которого помещаем ОБЪЕКТ с параметрами: Ключ(Св-во) - Значение

              //  Значение ключа (key) - вынимаем из localStorage (по своему ключу - `Корзина`) -  это Объект который представляет собой {id: Кол-во товара} - отложенного в "КОРЗИНУ" для покупки : F12 -> Application-> Local Storage

            
                headers: {
                  "Accept": "application/json",
                  "Content-Type" : "application/json"
                } // ХЕАДЕР ОТВЕТА - возвращаем информацию о Возвращающем ТИПЕ КОНТЕНТА - JSON
             })
        //   .then((response) =>  response.json()) - без {} - return МОЖНО НЕ ПИСАТЬ !!!  
            .then((response) =>  { 
              console.log(response); // Response {type: 'basic', url: 'http://localhost:3000/finish-order', redirected: false, status: 200, ok: true, …}

              return response.json();
            }) //Прочитать тело запроса (body: (...)) СРАЗУ как Объект 

  // получаем тело ответа
          // _________________________________________________________________________
          //   var content = await response.text();    читает ответ и возвращает как  обычный текст - СТРОКУ! - Чтобы преобразовать ее в Object необходимо:

          //    var obj = JSON.parse(content); чтобы преобразовать в Object!!! - со всеми присущими ему методами (а НЕ - строку)
          // ________________________________________________________________________
          // Чтобы Cразу ВЕРНУТЬ Object!!! - со всеми присущими ему методами (а НЕ - JSON-СТРОКУ), минуя JSON.parse(content) - необходимо : var content = await response.json(); // вернет Object!!!


            .then((body) => {

                console.log(body); // `1` - app.js стр. 770 или `0` - app.js стр. 774 -> Ответ сервера на POSt-Запрос

                  if (body == 1) {//ОПЕРАТОР РАВЕНСТВА "==" предназначен для СРАВНЕНИЯ ТОЛЬКО ЗНАЧЕНИЙ ДВУХ ПЕРЕМЕННЫХ => (одно значение ЧИСЛО, а ВТОРОЕ СТРОКА -  ПРЕОБРАЗУЕТСЯ В ЧИСЛО. т.е. "1" преобр в 1; т.е. 1 равно 1 = true

                    // Аналогично стр.29-34
                    Swal.fire({
                      title: 'Email-Success',
                      text: 'Ф-ция sendMail() - сработала. Email отправлен!',
                      icon: 'success',
                      confirmButtonText: 'OK'
                    });

                  } else {

                    // Аналогично стр.29-34
                    Swal.fire({
                      title: 'Проблемы с ПОЧТОВЫМ СЕРВИСОМ',
                      text: 'Email-ERROR',
                      icon: 'error',
                      confirmButtonText: 'OK'
                    });
                  };
               })

            .catch((error) => console.log(error));
};
