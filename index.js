/*
  Criando uma Biblioteca
 */
const express = require("express"); //Importa o módulo Express
const path = require("path");
const { Pool } = require("pg");

// Criando o Servidor Express
const app = express(); // Instancia um servidor Express

// Configuração do Servidor
app.set("view engine", "ejs"); //Visualizações criadas no Express
app.set("views", path.join(__dirname, "views")); //Visualizações na pasta views
app.use(express.static(path.join(__dirname, "public"))); //Os arquivos estáticos são salvos na pasta public
app.use(express.urlencoded({ extended: false }));

// Conexão do Banco de Dados PostgreSQL
const pool = new Pool({
  user: "hpedxbmk",
  host: "postgres://hpedxbmk:Rmy2rMYYYg8aXo2oTv7O7V_u3sp5W3U7@motty.db.elephantsql.com:5432/hpedxbmk",
  database: "hpedxbmk",
  password: "Rmy2rMYYYg8aXo2oTv7O7V_u3sp5W3U7",
  port: 5432
});
console.log("Sucesso com a conexão do Banco de Dados");

// Iniciando o Servidor
app.listen(8081, () => {
  console.log("Server started (http://localhost:8081/) !");
});

// Comando GET / Responde às solicitações GET apontando para a raiz do site "/".
// Responde às solicitações HTTP GEt que chegam na URL passasa pela linha (req, res)=>{}
app.get("/", (req, res) => {
   //res.send("Hello world...");
  res.render("index");
});

// Comando GET /about
app.get("/about", (req, res) => {
  res.render("about");
});

// Comando GET /data
app.get("/data", (req, res) => {
  const test = {
    title: "Test",
    items: [
      "One - Clique em Sobre para saber mais sobre o aplicativo.", 
      "Two - Clique em Dado para ver esta tela.", 
      "Three - Clique em Livros para ver todos os livros registrados."
    ]
  };
  res.render("data", { model: test });
});

// Comando GET /books
app.get("/books", (req, res) => {
  const sql = "SELECT * FROM Books ORDER BY Title";
  pool.query(sql, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("books", { model: result.rows });
  });
});

// comando GET /create
app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

// Comando POST /create
app.post("/create", (req, res) => {
  const sql = "INSERT INTO Books (Title, Author, Comments) VALUES ($1, $2, $3)";
  const book = [req.body.title, req.body.author, req.body.comments];
  pool.query(sql, book, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/books");
  });
});

// Comando GET /edição/5
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Books WHERE Book_ID = $1";
  pool.query(sql, [id], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("edit", { model: result.rows[0] });
  });
});

// Comando POST /ediçaõ/5
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const book = [req.body.title, req.body.author, req.body.comments, id];
  const sql = "UPDATE Books SET Title = $1, Author = $2, Comments = $3 WHERE (Book_ID = $4)";
  pool.query(sql, book, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/books");
  });
});

// Comando GET /delete/5
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Books WHERE Book_ID = $1";
  pool.query(sql, [id], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("delete", { model: result.rows[0] });
  });
});

// Comando POST /delete/5
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Books WHERE Book_ID = $1";
  pool.query(sql, [id], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/books");
  });
});
