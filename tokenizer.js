const nlp = require('compromise');
const plg = require('compromise-speech');
const fs = require('fs');
nlp.extend(plg);
let input = "Movies with Arnold Schwarzenegger, Sylvester Stallone ";
let doc = nlp(input.replace(`,`, " 1 "));
let json = doc.json();

const structure = json[0].terms;
//console.log(structure);
let names = [];
let index = 0;
let temp = "";
let tags = ["ProperNoun", "Person"]
structure.forEach(element => {
    if (element["tags"].some(e => tags.includes(e))) {
        temp += element["text"] + " ";
    } else {
        temp = temp.trim();
        if (temp.length != 0)
            names.push(temp);
        temp = "";
    }

});

if (temp.length != 0)
    names.push(temp);

let namess = JSON.stringify({
    "actors": names
}, null, 2)
console.log(namess);

let datax = namess;

var axios = require('axios');
var data = datax;

var config = {
    method: 'post',
    url: 'http://localhost:8080/',
    headers: {
        'Authorization': 'Bearer EAAH1ZCFmU2OsBAD6HH3S5wqOLDiNRSoKcA4yjT2Lue2hZBc3fCpOWf1oVDh0uFkF46jMgideOjwsgcfKXqholiyONZCyPMNbzfmzKa7JGT7gLpk2ZCQWyYjxvDgdNzMaZC0f1ZAbO98eo8sTxhGDgMwhirdG6cbgWtXcbpf0VBk0dJBpBNAZAkfAtWneQj1H7BKGoaRhGa7UgZDZD',
        'Content-Type': 'application/json'
    },
    data: data
};

axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data, null, 2));
    })
    .catch(function (error) {
        console.log(error);
    });