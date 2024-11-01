# Современные технологии создания web-систем

### Создание web-приложения на Node JS и Express
1. Установите [*Node.js*](https://nodejs.org/en/download/prebuilt-installer)
2. Создайте [новый проект и установите фреймворк *express*](https://expressjs.com/ru/starter/installing.html)
3. Напишите [простой обработчик запросов](https://expressjs.com/ru/starter/hello-world.html) и попробуйте его запустить
4. Создайте следующие папки:
- `public` - содержит статические файлы, доступные напрямую клиентам (HTML, JS, CSS, картинки и т.д.)
- `controllers` - содержит JS-скрипты с функциями, которые обрабатывают входящие запросы
- `routes` - содержит JS-скрипты с маршрутизацией приложения, где настраиваются *URI* и назначаются контроллеры для обработки запросов.
- `db` (или любое другое название) - содержит JSON-файлы с данными

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
	        // то отправляет ответ со статусом 500 (ошибка на сервере)
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
        let newObj = req.body;

        newObj.id = fileData.length + 1;
        fileData.push(newObj);

        res.status(200).json({ id: newObj.id });
    },

    deleteData: (req, res) => {
        const id = req.body.id;

        fileData = fileData.filter(e => e.id != id);

        res.status(200).send();
    }
}
```
