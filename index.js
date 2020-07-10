const express = require('express')
const {google} = require('googleapis');
const path = require('path')
const request = require('request')
const cors = require('cors')
const bodyParser = require('body-parser')
const queryParse = require('query-string')
const urlParse = require('url-parse')
const axios = require ('axios')


//SERVER//
const app = express()
app.use(bodyParser.json())
app.use(cors())

const oathClient = new google.auth.OAuth2(
    //client Id//
    '171442554582-vr1ftf5n83d28lop7uvpnhnlkqul9hup.apps.googleusercontent.com',
    //client secret//
    'OVyHx7dkZu4NiKj34hMok96z',
    //redirect url//
    'http://localhost:5000/login',
)

//Route//
// app.get('/login/doc',(req,res) => res.sendFile(path.join(__dirname,'index.html')))

app.get('/',(req,res) =>{
    oathClient
    const scopes =['https://www.googleapis.com/auth/drive.file']    
    const url =oathClient.generateAuthUrl({
        access_type:"offline",
        scope:scopes,
        state:JSON.stringify({
            callbackUrl:req.body.callbackUrl,
            userID:req.body.userid,
    

        }),
        client_id:'171442554582-vr1ftf5n83d28lop7uvpnhnlkqul9hup.apps.googleusercontent.com',
        redirect_uri:'http://localhost:5000/login'
    })
    request(url, (err, response,body) =>{
        // console.log('error',err)
        // console.log('status',response && response.statusCode )
        res.send({url})
    })

})


app.get('/login', async (req,res)=>{
    //Grab URL//
    const queryUrl = new urlParse(req.url)
    //Parse the Url

    const code = queryParse.parse(queryUrl.query).code
    const tokens =  await oathClient.getToken(code)
    console.log(tokens)
    const apiKey = 'AIzaSyBrUOuYhUaDXBF0ij3sOeh-WPl5xaeXBzM'
    const url = `https://www.googleapis.com/drive/v3/files?key=${apiKey}`
    res.send('hello')

    try{
       const response  =await axios({
            method:'GET',
            url,
            Authorization:'Bearer' + tokens.tokens.access_token,
            'Accept':'application/json',
          })
          console.log(response)
    }catch(e){
        console.log(e)
    }


})


//Listen on port 5000
const port = process.env.PORT || 5000


// // //Open app on port 5000//

app.listen(port,() => console.log(`Up and running on port ${port}`))












