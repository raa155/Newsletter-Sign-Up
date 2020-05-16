const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));




app.get('/', (req, res) => {
   res.render('signup', {
       
   })
})


app.post('/' , (req, res) => {

    // parse the body of the sign up form and retrieve First name, Last Name, and email address
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    // create a constant named data and create an object with key value pairs that mailchimp api will understand and set them equal to the information that was parsed previously.
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME : firstName,
                    LNAME: lastName
                }
            }
        ]
    }
 // turn the javascript object data into a flat packed jason object which we can then send over to the mailchimp API
 const jsonData = JSON.stringify(data);

//Enter your Mail Chimp List id below

//make sure where it says usx to replace that with your api key for example at the end of my api key, it reads us19
 const url = "https://usx.api.mailchimp.com/3.0/lists/ENTER LIST ID HERE";



 // auth section enter any name ex: roman1 followed by a : and then add your api key!
 const options = {
     method: "POST",
     auth: ""
 }

 //This will check to see if the request to the mailchimp API was successful in that case send the user to a success page and if it fails meaning the status code of our response was not 200, then it will redirect them to a failure page to hopefully try again. 
 const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {

        res.render('success', {
        
        });

    } else {
        
        res.render('failure', {
        
        });
    
    }

     response.on('data', (data) => {
         console.log(JSON.parse(data));
     })
 })

 request.write(jsonData);
 request.end();

});




app.listen(3000, () => {
    console.log('Application is listening on port 3000');
})



