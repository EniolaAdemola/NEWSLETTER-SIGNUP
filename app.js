const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("node:https");
const secrete = require("./secrete")

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// For our static files
app.use(express.static("public"));

app.get("/signup", (req, res) => {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/signup", (req, res) => {
	const firstName = req.body.fName;
	const lastName = req.body.lName;
	const email = req.body.email;

	console.log(firstName, lastName, email);
	const data = {
		members: [
			{
				email_address: email,
				// EMAIL: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
					// EMAIL: email,
				},
			},
		],
	};

	const jsonData = JSON.stringify(data);
	console.log(jsonData);

	const url = "https://us14.api.mailchimp.com/3.0/lists/"+secrete.listID;

	const options = {
		method: "POST",
		auth: "Eniola:"+secrete.apiKey,
	};

	const request = https.request(url, options, (response) => {
		if (response.statusCode === 200) {
			// Succes Sign in
			res.sendFile(__dirname + "/success.html");
		} else {
			// send failure page
			res.sendFile(__dirname + "/failure.html");
		}

		response.on("data", (data) => {
			console.log(JSON.parse(data));
		});
	});
	// update_existing: true;
	request.write(jsonData);
	request.end();
});

app.post("/failure", (req, res) => {
	res.redirect("/signup")
});

// Create a dynamic port for heroku to define
app.listen(process.env.PORT || 3000, () => {
	console.log("App listening on 3000");
});
