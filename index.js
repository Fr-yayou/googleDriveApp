const express = require('express')
const {google} = require('googleapis');
const path = require('path')
const request = require('request')
const cors = require('cors')
const bodyParser = require('body-parser')
const queryParse = require('query-string')
const urlParse = require('url-parse')
const axios = require ('axios')
const OAuth2data = require('./credientials.json')
const ejs = require('ejs')

//Extract infos from credientials.json//
const CLIENT_ID = OAuth2data.web.client_id
const CLIENT_SECRET = OAuth2data.web.client_secret
const REDIRECT_URI= OAuth2data.web.redirect_uris[0]

//store user info//
var name,picture

// //SERVER//
const app = express()
app.use(bodyParser.json())
app.use(cors())
app.set("view engine","ejs")

//Listen on port 5000
const port = process.env.PORT || 5000


// // //Open app on port 5000//

app.listen(port,() => console.log(`Up and running on port ${port}`))

//Create client object//
const OAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)

var authed = false
//Request to the google api scopes//
const SCOPES = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file"


app.get('/',(req,res) =>{
    if(!authed){
        var url = OAuth2Client.generateAuthUrl({
            access_type:'offline',
            scope:SCOPES
    })
    res.render("index",{url:url})
    }else{

    }
})

app.get('/login',(req,res)=>{
    const code = req.query.code
    if(code){
        //get access token//
        OAuth2Client.getToken(code,function(err,tokens){
            if(err){
                console.log("Error in Authenticating")
                console.log(err)

            }else{
                console.log("Successfully authenticated")
                console.log(tokens)
                OAuth2Client.setCredentials(tokens)

                authed =true
                res.redirect('/login')
            }
        })
    }else{
        var oauth2 = google.oauth2({
            auth:OAuth2Client,
            version:'v2'
        })
        //user infos//
        oauth2.userinfo.get(function(err,response){
            if(err) throw err
            name = response.data.name
            picture = response.data.picture
            res.render("sucess",{name:name,picture:picture})
        })
        oauth2.drive.list(function(err,response){
            if(err) throw err
            console.log(response.data)
        })
    }
})


//Route//
// app.get('/login/doc',(req,res) => res.sendFile(path.join(__dirname,'index.html')))

// app.get('/',(req,res) =>{
//     oathClient
//     const scopes =['https://www.googleapis.com/auth/drive.file']    
//     const url =oathClient.generateAuthUrl({
//         access_type:"offline",
//         scope:scopes,
//         state:JSON.stringify({
//             callbackUrl:req.body.callbackUrl,
//             userID:req.body.userid,
//         }),
//     })
//     request(url, (err, response,body) =>{
//         res.send({url})
//     })

// })


// app.get('/login', async (req,res)=>{
//     //Grab URL//
//     const queryUrl = new urlParse(req.url)
//     //Parse the Url
//     const code = queryParse.parse(queryUrl.query).code
//     const tokens =  await oathClient.getToken(code)
//     oathClient.setCredentials(tokens)
//     const apiKey = 'AIzaSyCMrbpHs1NY1nytjq0SRFPuQdaE2fuUn78'
//     const url = `https://www.googleapis.com/drive/v3/files?key=${apiKey}`
//     res.send('hello')

//     try{
//        const response  =await axios({
//             method:'GET',
//             url,
//             Authorization:'Bearer' + tokens.tokens.access_token,
//             'Content-Type':'application/json',
//           })
//           console.log(response.data)
//     }catch(e){
//         console.log(e)
//     }


// })












