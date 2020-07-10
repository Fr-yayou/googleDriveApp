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
    const scopes =['https://www.googleapis.com/auth/drive/files']
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

// const fs = require('fs');
// const readline = require('readline');

// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = 'token.json';

// // Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Drive API.
//   authorize(JSON.parse(content), listFiles);
// });

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(credentials, callback) {

//   const oAuth2Client = new google.auth.OAuth2("171442554582-vr1ftf5n83d28lop7uvpnhnlkqul9hup.apps.googleusercontent.com", "OVyHx7dkZu4NiKj34hMok96z","http://localhost:5000/login");

//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getAccessToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     callback(oAuth2Client);
//   });
// }

// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
// function getAccessToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }

// /**
//  * Lists the names and IDs of up to 10 files.
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// function listFiles(auth) {
//   const drive = google.drive({version: 'v3', auth});
//   drive.files.list({
//     pageSize: 10,
//     fields: 'nextPageToken, files(id, name)',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const files = res.data.files;
//     if (files.length) {
//       console.log('Files:');
//       files.map((file) => {
//         console.log(`${file.name} (${file.id})`);
//       });
//     } else {
//       console.log('No files found.');
//     }
//   });
// }











