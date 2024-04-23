require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connection } = require('./config/db');
const { userRouter } = require('./routes/user.routes');

const app = express();

app.use(express.json(),cors());
app.use('/user', userRouter);

app.get("/",userRouter,async(req,res)=>{
    res.send({msg:"this is home route"})
})

// github
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const client_id = "9b987759816c71fff1f6";
const client_secret = "dd2eb7da8a3124eb60b3a9283c7f2f9bb9919b4e";
app.get("/login", (req, res) => {
    res.sendFile("Frontend" + "/index.html" );
})

app.get("/auth/github", async(req, res) => {
    const code = req.query.code;

    const response = await fetch("https://github.com/login/oauth/access_token",{
        method : "POST",
        headers:{
            'Content-Type' : 'application/json',
            Accept:'application/json'
        },
        body : JSON.stringify({
            client_id,
            client_secret,
            code
        })
    })
    .then((res) => res.json())
    // .then((res) => console.log(res))
    .catch((err)=> console.log(err))

    console.log(response);
    const access_token = response.access_token;
    const user_data = await fetch("https://api.github.com/user",{
        headers:{
            "Authorization" : `Bearer ${access_token}`
        }
    })
    .then((res)=>res.json())
    console.log(user_data);

    res.send("github callback route page" + code);
})





app.listen(process.env.PORT , async()=>{
    try{
        await connection;
        console.log(`Connected to DB`);
        console.log(`Server is running on port ${process.env.PORT}`);
    }catch(err){
        console.log(err);
    }
})