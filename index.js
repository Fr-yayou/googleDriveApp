const express = require('express')
const {google} = require('googleapis');
const cors = require('cors')
const bodyParser = require('body-parser')
const OAuth2data = require('./credientials.json')
const ejs = require('ejs')

//Extract infos from credientials.json//
const CLIENT_ID = OAuth2data.web.client_id
const CLIENT_SECRET = OAuth2data.web.client_secret
const REDIRECT_URI= OAuth2data.web.redirect_uris[0]

//store user info//
var user,userPic
var authed = false

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

//Request to the google api scopes//
const SCOPES = " https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.metadata   "


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

            }else{
                console.log("Successfully authenticated")
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
       // user infos
        oauth2.userinfo.get(function(err,response){
            if(err) throw err
            user = response.data.name
            userPic = response.data.picture
            res.render("sucess",{user:user,userPic:userPic})
        })

        //get list of the drive user
        const drive = google.drive({
            version:'v3',
            auth:OAuth2Client
        })
        drive.files.list({
        //    q:mimeType='application/vnd.google-apps.spreadsheet'

        },(err,response)=>{
            if(err) return console.log(err)
            data = response.data.files
            console.log(data)
        })
    }
})

app.get('/login/files',(req,res)=>{
    const code2 = req.query.code
    res.send(code2)
})





// copy file selected we need to use  this  api https://www.googleapis.com/drive/v2/files/fileId/copy
// we need to retrive the id to do a post request//


//scope pour modifier spread sheet 

//https://sheets.googleapis.com/v4/spreadsheets/spreadsheetId/values/Sheet1!A1:D5?valueInputOption=USER_ENTERED















