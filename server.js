// Define app using express
var express = require("express")
var app = express()
// Require database SCRIPT file
var db = require('./database.js')
// Require md5 MODULE
var md5 = require("md5")
// Make Express use its own built-in body parser
 app.use(express.urlencoded({ extended: true }));
 app.use(express.json());

// Set server port
var HTTP_PORT = 5000
// Start server
const server= app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// READ (HTTP method GET) at root endpoint /app/
app.get("/api/", (req, res, next) => {
    res.json({"message":"Your API works! (200)"});
	res.status(200);
});

// Define other CRUD API endpoints using express.js and better-sqlite3
// CREATE a new user (HTTP method POST) at endpoint /app/new/
app.post("/app/new", (req,res) =>{
const stmt = db.prepare("INSERT INTO userinfo (user,pass) VALUES (?,?)");
const info = stmt.run(req.body.user, req.body.pass);
res.status(201).send(info.changes+ " record created: ID " +info.lastInsertRowid);
});


// READ a list of all users (HTTP method GET) at endpoint /app/users/
app.get("/app/users", (req, res) => {
	const stmt = db.prepare("SELECT * FROM userinfo").all();
	res.status(200).json(stmt);
});

// READ a single user (HTTP method GET) at endpoint /app/user/:id
app.get("/app/user/:id", (req, res) => {
	const stmt = db.prepare("SELECT * FROM userinfo WHERE id = ?");
	const id_1 = stmt.get('1');
	console.log(id_1);

	res.status(200).json(stmt);
});

// DELETE a single user (HTTP method DELETE) at endpoint /app/delete/user/:id

// Default response for any other request
app.use(function(req, res){
	res.json({"message":"Endpoint not found. (404)"});
    res.status(404);
});

// Tell STDOUT that the server is stopped
process.on('SIGTERM', () => {
	server.close(() => {
		console.log('Server stopped.')
	});
});
