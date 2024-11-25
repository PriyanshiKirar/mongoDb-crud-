// require("./config/db.config");
// const express = require("express");
// const app = express();
// const path=require('path');
// const userModel = require("./model/user.model");
// const selModel = require("./model/sell.model")

// app.set("view engine", "ejs");

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname,"public")))

// // create operation
// app.get("/create", async function (req, res) {
//     const user = await userModel.create({
//         name: "abhi",
//         email: "patel@err",
//         age: 23,
//     })
//     res.send(user);
// });
// app.get("/createSel", async function (req, res) {
//     const sel = await selModel.create({
//         product: "abhi",
//         prize: 230,

//     })
//     res.send(sel);
// });
// //read the all data of users usig find method
// app.get("/read", async function (req, res) {
//     const alluser = await userModel.find();
//     res.send(alluser);
// });
// //read the data of one  user using findone method

// app.get("/user/:username", async function (req, res) {
//     const user = await userModel.findOne({ name: req.params.username });
//     res.send(user);
// });
// // do update the value
// app.get('/update/:username', async function (req, res) {
//     let updated = await userModel.findOneAndUpdate({ name: "abhi" }, { name: "abhi patel" }, { new: true });
//     res.send(updated)
// });
// // app.get('/update/:username',async function(req,res){
// //     let user=await userModel.findOneAndUpdate({name:req.params.username},{name:"arsh"});
// //     user.name=user.name,
// //     await user.save();
// //     res.send(user)
// // });

// app.get('/delete', async function (req, res) {
//     let deleted = await userModel.findOneAndDelete({ name: "arsh" });
//     res.send(deleted)
// })

// //from part start
// app.get("/", function (req, res) {
//     res.render("index")
// });
// app.post("/register", async function (req, res) {
//     let { name, email, age } = req.body;
//     let create = await userModel.create({
//         name,
//         email,
//         age,
//     })
//     res.send(create)
// });
// app.listen(3000);


//                Authetication
require("./config/db.config");
const express = require('express');
const app = express();
const userModel = require("./model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const expressSesion=require("express-session");
const flash=require('connect-flash')

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSesion({
    secret: 'sdfghjklll',
    resave: false,
    saveUninitialized: true,
}))
app.use(flash());

app.get("/", function (req, res) {
    res.render("register");
})
// here islogged middleware pass kiya h agr loggein hoga to rout open hoga
app.get('/screte',islogged,function(req,res){
res.send("screttttt")
})

app.get("/profile", function (req, res) {

    let token = req.cookies.token;
    //do  veryfy the token
    jwt.verify(token, "screte", (err, decoded) => {
        res.send(decoded);
    })
})
app.post('/register',async function (req, res) {
    // res.send(req.body)
    const { name, email, password } = req.body;
const user=await userModel.findOne({email});
if(user) return res.send("user alserdy exis");
res.redirect("/register");
    //paasword ko encrypt krna 
    bcrypt.genSalt(10, function (err, salt) {
        console.log(salt)
        bcrypt.hash(password, salt, async function (err, hash) {
            console.log(hash)
            const user = await userModel.create({
                name,
                email,
                password: hash,  //encrypted password aatah hash m
            })
            //for save the token in our browser
            const token = jwt.sign({ email }, "screte");
            res.cookie("token", token);
            res.send(user);
        });
    })
})

app.get('/login', function (req, res) {
    res.render('login');
})
app.post('/login', async function (req, res) {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email })
    if (!user) return res.send('email or password inccorrect')
    //compare kr rhe h register krte time jo email password diye the login krte time match kr rhe h
    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            // return res.send("loggedin")
            let token = jwt.sign({ email }, "screte");
            res.cookie("token", token);
            res.send("loggedin")
        }
        else return res.send("email or password incorrect")
    })
});

//make this middleware if person is logged in other rout s pehle caheck kr h then bo rout chal h
function islogged(req,res,next){
    if(!req.cookies.token) return res.redirect("/login")
        jwt.verify(req.cookies.token,"screte",function(err,decoded){
    if(err){
        res.cookie("token","");
        res.redirect("/login")
    }
    // console.log(decoded)
    else {
        req.user=decoded;
        next();
    }
    })
}
app.listen(process.PORT || 3000);