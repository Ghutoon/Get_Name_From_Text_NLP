let express = require("express");
let axios = require('axios');
let exp = express();
let port = 8081;

require('dotenv').config();
exp.use(express.json());
exp.use(express.urlencoded({
    extended: true
}));

const nlp = require('compromise');
const plg = require('compromise-speech');
const fs = require('fs');
nlp.extend(plg);

let query_result = null;

async function post_to_whatsapp(message) {
    let resultx = null;
    var reply_body = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": "917044174529",
        "type": "text",
        "text": {
            "body": message
        }
    });

    var config = {
        method: 'post',
        url: 'https://graph.facebook.com/v15.0/101412459527848/messages',
        headers: {
            'Authorization': `Bearer ${process.env.TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: reply_body
    };
    try {
        resultx = await axios(config);
    } catch (err) {
        console.log(err.message);
    }
    return resultx;

}
async function tokenize_and_retrieve(input) {
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
    //console.log(namess);

    let datax = namess;

    var axios = require('axios');
    var data = datax;

    var config = {
        method: 'post',
        url: 'https://query-maker-lya4aju3q-ghutoon.vercel.app/',
        headers: {
            'Authorization': `Bearer ${process.env.TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: data
    };
    try {
        query_result = await axios(config);
        //console.log(query_result.data);
    } catch (err) {
        console.log(err.message)
    }
    return query_result;
}
exp.get("/verify", (req, res) => {
    console.log(req.body);
    if (req.query['hub.verify_token'] == "niladri")
        res.send(req.query['hub.challenge'])
    else
        res.sendStatus(403);
});
exp.post("/verify", async (req, res) => {
    //let input = "Movies with Arnold Schwarzenegger, Sylvester Stallone ";
    let input = req.body.entry[0].changes[0].value["messages"][0]["text"]["body"];
    query_result = await tokenize_and_retrieve(input);
    query_result.data["results"].forEach(element => {
        let title = element["original_title"];
        console.log(title);
        let wp_response = post_to_whatsapp(title);
    });
    /*let results = query_result.body["results"];
    results.array.forEach(element => {
        console.log(element["original_title"]);
    });*/
    //res.send(query_result["results"])
    res.send(200);
});

exp.listen(port, () => {
    console.log(`Server running at port ${port}`)
})