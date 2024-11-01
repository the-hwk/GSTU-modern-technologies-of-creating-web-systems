"use strict";

function jsonDataToHTML(jsonData) {
    return `
        <div class="card" id=card-${jsonData.id}>
            <h1>${jsonData.id}</h1>
            <button onclick=deleteData(${jsonData.id})>Delete</button>
            <span>${jsonData.info}</span>
        </div>
    `;
}

function deleteData(id) {
    fetch('/api/v1/data', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
        .then(res => {
            if (res.ok) {
                const obj = document.querySelector(`#card-${id}`);
                console.log(obj);
                document.querySelector('#data-container').removeChild(obj);
            }
        })
}

window.onload = function() {
    const container = document.querySelector('#data-container');

    fetch('/api/v1/data')
        .then(res => {
            return res.json();
        })
        .then(data => {
            data.forEach(e => {
                container.innerHTML += jsonDataToHTML(e);
            });
        });
}