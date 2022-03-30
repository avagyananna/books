
const mongoose = require("mongoose");

const options = {
    useNewUrlParser:  true,
    autoReconnect: false,
    bufferMaxEntries: 0,
    bufferCommands: false,
    connectTimeoutMS:  20000,
    poolSize: 50,
    useUnifiedTopology: true
};

mongoose.connect(
    "mongodb://localhost:27017/books",
    options
);

mongoose.connection.on("disconnected", (err) => {
    console.log("error", err);
    console.log("MongoDB", "Reconnecting");
    mongoose.connect("mongodb://localhost:27017/books", options);
});
mongoose.connection.on("open", () => {
    console.log("info", "Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
    console.log("error", err);
});

/*
* Schemas
* */

const Schema = mongoose.Schema;
const booksSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },

}, {
    minimize: false,
    versionKey: false
});
const BookModel = mongoose.connection.model("Books", booksSchema, "books");

module.exports = {
    BookModel
};
