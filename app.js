//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const keys = require(__dirname + "/passwords.js")

const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) =>{
   const email = req.body.email;
   const name = req.body.name;
   console.log("welcome " + email);

   const subscriber = {
       members: [
           {
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: name
            }
           }
       ]
   }

   const jsonSubscriber = JSON.stringify(subscriber);

   const url = "https://us6.api.mailchimp.com/3.0/lists/"+keys.listId;
   const options ={
       method : "POST",
       auth: keys.apiKey
   }

   const request = https.request(url, options, (response) =>{
       response.on('data', data =>{
          let userData = JSON.parse(data);
       });

       if(response.statusCode === 200){
           res.sendFile(__dirname + "/success.html")
       }else{
        res.sendFile(__dirname + "/failure.html")
       }

   })

   request.write(jsonSubscriber);
   request.end();

})


//failure to subscribe redirect form
app.post("/failure", (req,res) =>{
    res.redirect("/")
})

app.listen(3000, () =>{
    console.log("server has started on port 3000");
})




 