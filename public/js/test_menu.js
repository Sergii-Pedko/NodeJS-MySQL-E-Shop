//______________________  Пропишем СКРИПТЫ И ПОДКЛЮЧИМ в файл test_index.pug стр.24 ________________________ 

// ДЕЛЕГТРОВАНИЕ - Идея в том, что если у нас есть МНОГО ЭЛЕМЕНТОВ, события на которых нужно обрабатывать похожим образом, то ВМЕСТО ТОГО, ЧТОБЫ НАЗНАЧАТЬ - ОБРАБОТЧИК КАЖДОМУ, мы СТАВИМ - ОДИН ОБРАБОТЧИК НА ИХ ОБЩЕГО ПРЕДКА - <ul>.

// ОБРАБОТЧИК события ВЕШАЕМ не на каждую ВЛОЖЕННУЮ <li>  - А НА ИХНЕГО ОБЩЕГО ПРЕДКА <ul class="js-menu-button"> -        test_menu.pug стр.4

// Нажимая на любой <li> - мы получим выполнение ф-ции-func()

let ul = document.querySelector(`.js-menu-button`);

console.log(ul);

let myFunc = (event) => {
  if (event.target.getAttribute("class") == `menu-list-element-a`) { // getAttribute("class") - ЧТЕНИЕ атрибута - class; т.е. мы попадаем в ссылку a<target="_blank" class="menu-list-element-a" href="...">

      alert(`Был клик по Ссылке: ${event.target.innerText}`); // innerText - отобразит ТЕКСТ - прописанный в соответствующей ссылке в файле: test_menu.pug
    };
};  

ul.addEventListener(`click`, myFunc);
