require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const port = 8080;
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const req = require("express/lib/request");
const { status } = require("express/lib/response");
const todoFilePath = process.env.BASE_JSON_PATH;

//Read todos from todos.json into variable
let todos = require(__dirname + todoFilePath);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());

app.use("/content", express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  // res.header("Content-Type","text/html");
  res.sendFile("./public/index.html", { root: __dirname });

  res.status(200);
});

app.get("/todos", (_, res) => {
  res.header("Content-Type", "application/json");
  res.sendFile(todoFilePath, { root: __dirname });

  res.status(200);
});

app.get("/todos/overdue", (_, res) => {
  res.header("Content-Type", "application/json");
  const overdueTodos = todos.filter((todo) => {
    return todo.due <= new Date(); //implement here, date comparison to find overdue
  });
  console.log;

  res.status(200).send(JSON.stringify(overdueTodos));
  
});

app.get("/todos/completed", (_, res) => {
  res.header("Content-Type", "application/json");
  const completedTodos = todos.filter((todo) => {
    return todo.completed == true;
  });

  res.status(200).send(JSON.stringify(completedTodos));

});

app.post('/todos', (req, res) => {
  var fs = require("fs");
  console.log( req.body );
  todos.push( ( req.body ) );
  if (!todos) return res.sendStatus(400);
  fs.writeFile( __dirname + todoFilePath , JSON.stringify(todos) , err => {
    if (err) {
      console.error(err)
      return
    }
});
  res.json(todos);

 });

 //Add POST request with path '/todos'

app.post('/todos', (_, res) => { 
  const oneNewTodo= {
      "id"    : todos.length + 1,
    "name" : 'Turn on central heating',
    "created" : "2021-10-20T18:25:43.511Z",
     "due": new Date,
     "completed" : true
  };
  todos.push(oneNewTodo)
 if (!_.body.due){
   return res.status(400).end();
 }
 
  res.header("Content-Type","application/json");
  fs.writeFile(__dirname + process.env.BASE_JSON_PATH,  JSON.stringify(todos), err => {
   
    if (err) {
      console.error(err)
      return
    }

 res.status(201).send(todos);
 })});

//Add PATCH request with path '/todos/:id

app.patch('/todos/:id', (req, res) => {
  const foundTodo = todos.find((todo)=> {return todo.id == req.params.id })
if (!foundTodo){
  return res.status(400).send("bad request")
}

  var fs = require("fs");
  console.log( req.params.id );
  const newTodos = todos.map( todo => {
      if (todo.id == req.params.id ){
        todo = { 
         ...todo,
          ...req.body} ;
      }
      return todo
   } );


  fs.writeFile( __dirname + todoFilePath , JSON.stringify(newTodos) , err => {
    if (err) {
      console.error(err)
      return
    }
});
  res.status(200).json(newTodos);
 });

//Add POST request with path '/todos/:id/complete

app.post('/todos', (req, res) => {
  var fs = require("fs");
  console.log( req.body );
  todos.push( ( req.body ) );
  if (!todos) return res.sendStatus(400);
  fs.writeFile( __dirname + todoFilePath , JSON.stringify(todos) , err => {
    if (err) {
      console.error(err)
      return
    }
});
  res.json(todos);

 });
//Add POST request with path '/todos/:id/undo

//Add DELETE request with path '/todos/:id

app.listen(port, function () {
  console.log(`Node server is running... http://localhost:${port}`);
});

module.exports = app;
