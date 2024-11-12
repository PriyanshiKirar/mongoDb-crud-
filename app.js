require("./config/db.config");
const express = require("express");
const app = express();
const userModel = require("./model/user.model");
const selModel = require("./model/sell.model")

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create operation
app.get("/create", async function (req, res) {
    const user = await userModel.create({
        name: "abhi",
        email: "patel@err",
        age: 23,
    })
    res.send(user);
});
app.get("/createSel", async function (req, res) {
    const sel = await selModel.create({
        product: "abhi",
        prize: 230,

    })
    res.send(sel);
});
//read the all data of users usig find method
app.get("/read", async function (req, res) {
    const alluser = await userModel.find();
    res.send(alluser);
});
//read the data of one  user using findone method

app.get("/user/:username", async function (req, res) {
    const user = await userModel.findOne({ name: req.params.username });
    res.send(user);
});
// do update the value
app.get('/update/:username', async function (req, res) {
    let updated = await userModel.findOneAndUpdate({ name: "abhi" }, { name: "abhi patel" }, { new: true });
    res.send(updated)
});
// app.get('/update/:username',async function(req,res){
//     let user=await userModel.findOneAndUpdate({name:req.params.username},{name:"arsh"});
//     user.name=user.name,
//     await user.save();
//     res.send(user)
// });

app.get('/delete', async function (req, res) {
    let deleted = await userModel.findOneAndDelete({ name: "arsh" });
    res.send(deleted)
})

//from part start
app.get("/", function (req, res) {
    res.render("index")
});
app.post("/register", async function (req, res) {
    let { name, email, age } = req.body;
    let create = await userModel.create({
        name,
        email,
        age,
    })
    res.send("create")
});




app.listen(3000);