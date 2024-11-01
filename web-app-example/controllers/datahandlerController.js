const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../db/data.json');

var fileData = null;

function loadFileData() {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        fileData = JSON.parse(data);
    } catch (err) {
        console.error(`File error: ${err}`);
    }
}

loadFileData();

module.exports = {
    getData: (req, res) => {
        if (fileData === null) {
            return res.status(500).json({ message: 'File load error' });
        }
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