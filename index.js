const nlp = require('compromise');
const plg = require('compromise-speech');
const fs = require('fs');
nlp.extend(plg);
let input = "Movies with Niladri Shekhar Chatterjee,Morgan Freeman and Johnny Depp ";
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

let data = namess;

fs.writeFile("./queries.json", data, (err) => {
    if (err)
        console.log(err);
    else {
        console.log("File written successfully\n");
    }
});