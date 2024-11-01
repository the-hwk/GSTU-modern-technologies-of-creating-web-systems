const express = require('express');
const routes = require('./routes/routes');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/v1', routes);
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/hello', (req, res) => {
    res.sendFile(__dirname + '/public/hello.html');
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});