const express = require("express");
var bodyParser = require('body-parser');
const mongoose = require("mongoose");

const { BookModel } = require("./mongoServer");

const app = express();

app.use(bodyParser.urlencoded({ extended: false, type: "application/x-www-form-urlencoded" }));
app.use(bodyParser.json({
    type: function (v) {
        if (v.headers["content-type"]) {
            if (v.headers["content-type"].match(/multipart\/form-data/)) {
                return false;
            }
        }
        return true;
    },
    limit: "6mb"
}));

app.get("/books", async (req, res) =>{
    const skip  = req.query.skip || 0;
    const limit = req.query.limit || 100;
    const books = await BookModel.find({}, 
        null,
        {
            lean: true,
            skip,
            limit: limit + 1
        });
    res.status(200).json(books);
});

app.get("/books/:id", async (req, res) =>{
    try{
        const books = await BookModel.findOne({_id : mongoose.Types.ObjectId(req.params.id) });
        if(!books){
            return res.status(404).json(
                {
                    massage : "Not Found"
                }
            )
        }
        res.status(200).json(books)
    }catch(err){
        console.log(err)
        res.status(500).json("Oops")
    }
});

app.post("/books", async (req, res) =>{
    const book = req.body;
    try{
        await BookModel.create(book);
        res.status(200).json({
            massage : "Book created"
        })
    }catch(err){
        // console.log(err)
        res.status(500).json("Oops")
    }
});

app.put("/books/:id", async (req, res) =>{
    if(!req.params.id){
        return res.json(400).send({
            massage : "Bad request"
        })
    }
    try{
        const book = req.body;
        const result = await BookModel.updateOne({_id : mongoose.Types.ObjectId(req.params.id) }, { $set: book });
        if (!result.n) {
            return res.json(404).send({
                massage : "Not Found"
            })
        }
        res.status(200).json({
            massage : "Ok"
        });
    }catch(err){
        res.status(500).json("Oops")
    }
});

app.delete("/books/:id", async (req, res) =>{
    if(!req.params.id){
        return res.json(400).send({
            massage : "Bad request"
        })
    }
    try{
        const book = req.body;
        const result = await BookModel.deleteOne({_id : mongoose.Types.ObjectId(req.params.id) });
        if (!result.n) {
            return res.json(404).send({
                massage : "Not Found"
            })
        }
        res.status(200).json({
            massage : "Ok"
        });
    }catch(err){
        res.status(500).json("Oops")
    }
});



app.use("/", async (req, res) => {
    res.status(404).send({
        "message": "Bad request: format - GET|POST|PUT|DELETE http://localhost/books"
    });
});

app.listen(
    3000,
    function () {
        console.log("Node Tokens server is running on 3000 port");
    }
)
