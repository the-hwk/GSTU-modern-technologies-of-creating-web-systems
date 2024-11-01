# Современные технологии создания web-систем

1. Установите [*Node.js*](https://nodejs.org/en/download/prebuilt-installer)
2. Создайте [новый проект и установите фреймворк *express*](https://expressjs.com/ru/starter/installing.html)
3. Напишите [простой обработчик запросов](https://expressjs.com/ru/starter/hello-world.html) и попробуйте его запустить
4. Создайте следующие папки:
- `public` - содержит статические файлы, доступные напрямую клиентам (HTML, JS, CSS, картинки и т.д.)
- `controllers` - содержит JS-скрипты с функциями, которые обрабатывают входящие запросы
- `routes` - содержит JS-скрипты с маршрутизацией приложения, где настраиваются *URI* и назначаются контроллеры для обработки запросов.
- `db` (или любое другое название) - содержит JSON-файлы с данными

### Серверное приложение

Создайте в папке `controllers` контроллер для работы с данными (обычный JS файл). Для работы с файлами и используется модуль `fs`. Для составления пути к файлу используется модуль `path`:

```JavaScript
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../db/data.json');

// чтение файла
const data = fs.readFileSync(filePath, 'utf-8');
// парсинг строки в формат JSON
let fileData = JSON.parse(data);
```

Далее необходимо написать методы, выполняющие CRUD (Create, Read, Update, Delete) операции с данными. Функции необходимо экспортировать, чтобы фреймворк мог их использовать в других модулях. Все функции в качестве входных параметров принимают объекты `request` и `response` (запрос, ответ), с помощью которых можно получить данные запросов.

```JavaScript
// экспорт функций
module.exports = {
    getData: (req, res) => {
        if (fileData === null) {
	        // если данных нет (ошибка чтения файла)
	        // то отправляем ответ со статусом 500 (ошибка на сервере)
	        // и в тело ответа помещаем строку JSON формата
            return res.status(500).json({ message: 'File load error' });
        }
        // если данные есть, то отправляем ответ
        // со статусом 200 (OK) и в тело ответа
        // помещаем строку JSON формата, которая
        // представляет собой данные
        res.status(200).json(fileData);
    },

    addData: (req, res) => {
	    // берем данные из тела запроса
	    // (в данном случае они представляют собой
	    // JSON-объект)
        let newObj = req.body;

		// добавляем новые данные
        newObj.id = fileData.length + 1;
        fileData.push(newObj);

		// возвращаем ответ со статусом 200
		// в тело ответа помещаем JSON-объект
		// с id добавленного объекта
        res.status(200).json({ id: newObj.id });
    }

	// вам нужно реализовать остальные методы
	// для изменения и удаления данных
}
```

После этого необходимо связать методы контроллера с *URI* и [*HTTP*-методом](https://habr.com/ru/companies/timeweb/articles/853174/), по которому они должны быть вызваны. Для этого в папке `routes` создайте файл `routes.js`. В этом файле:

```JavaScript
const express = require('express');
// импортируем модуль для настройки маршрутизации
const router = express.Router();
// импортируем наш контроллер
const controller = require('../controllers/datahandlerController');

// настраиваем маршрутизацию:
// сопоставляем URI, HTTP-метод и метод контроллера,
// который должен быть вызван при запросе
// на этот URI
router.get('/data', controller.getData);
router.put('/data', controller.addData);

// для изменения данных - метод post
// для удаления данных - метод delete

module.exports = router;
```

Теперь в основном файле приложения (стандартно он называется `index.js`) необходимо добавить в [middleware](https://expressjs.com/ru/guide/writing-middleware.html) маршрутизацию, конвертер данных запроса в JSON формат и указать папку со статическими файлами:

```JavaScript
// импортируем наш модуль маршрутизации
const routes = require('./routes/routes');

// добавляем в middleware необходимые слои
app.use(express.json());           // конвертер тела запроса в JSON формат
app.use('/api/v1', routes);        // маршрутизация
app.use(express.static('public')); // статические файлы
```

Т.к. маршрутизация подключена по *URI* `/api/v1`, то для вызова метода контроллера необходимо выполнить запрос по *URI* `/api/v1/data`.

### Клиентское приложение

Запросы к серверу в *JS* выполняются с помощью [*AJAX*-запросов](https://developer.mozilla.org/ru/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data). Например, чтобы получить данные (которые серверное приложение читает из файла), необходимо:

```JavaScript
// выполняем GET-запрос на сервер по URI api/v1/data
fetch('/api/v1/data')
		// обработчики ответа сервера
        .then(res => {
            return res.json();    // преобразуем данные в JSON-формат 
        })
        .then(data => {
            data.forEach(e => {
                container.innerHTML += jsonDataToHTML(e);
            });
        });
```

Для того, чтобы в тело запроса поместить данные, необходимо:

```JavaScript
fetch('/api/v1/data', {
    method: 'POST',    // указываем HTTP-метод
    // в заголовке запроса указываем тип данных
    // чтобы сервер понимал как их обрабатывать
    // (в данном случае - данные в формате JSON)
    headers: {
        'Content-Type': 'application/json'
    },
    // помещаем данные в тело запроса
    // предварительно преобразовав их в строку
    body: JSON.stringify({ id: id })
})
	.then(res => {
		// если статус ответа 200 (OK)
		if (res.ok) {
			// ...
		} else if (res.status == 404) {
			// если статут ответа 404
		}
	})
```

### Что необходимо сделать

- в серверном приложении
	- написать обработчики для выполнения *CRUD* операций с данными (в качестве хранилища использовать *JSON*-файл)
		- также должна быть реализована обработка ошибок
- в клиентском приложении
	- после загрузки страницы приложение должно выполнять *GET*-запрос для получения данных и отображать данные в виде таблицы или карточек
	- в таблице/карточках для каждого объекта данных должны быть кнопки для изменения и удаления данных
		- при нажатии на кнопку для изменения данных должны появляться поля для редактирования (прямо в таблице/карточке), а также кнопки `Сохранить/Отмена`
	- перед таблицой/карточками должна быть форма для добавления объекта данных
	- все изменения должны выполнятся без перезагрузки страницы, путем динамического изменения *DOM*-дерева
