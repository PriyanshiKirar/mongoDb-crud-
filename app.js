require("./config/db.config");
const express = require("express");
const app = express();
const userModel = require("./model/user.model")
app.get("/", function (req, res) {
    res.send("indexpage")
});
app.get("/about", function (req, res) {
    res.send("about")
});
app.get("/create", async function (req, res) {
    const user = await userModel.create({
        name: "pinso",
        email: "patel@err",
        age: 23,
    })
    res.send(user);
});
app.get("/read", async function (req, res) {
    const alluser = await userModel.find();
    res.send(alluser);
})
app.get("/user/:username", async function (req, res) {
    const user = await userModel.find({name:req.params.username });
    res.send(user);
})

app.listen(3000);