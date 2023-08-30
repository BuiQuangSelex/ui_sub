import express from "express";
const app = express();

const myLogger = function (req, res, next) {
    console.log(req.query.name);
    next();
};

app.get("/name", myLogger, function (req, res) {
    res.send("Hello World");
});

app.listen(3000, console.log("listening on port 3000..."));
