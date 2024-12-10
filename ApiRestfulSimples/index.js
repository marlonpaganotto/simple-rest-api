const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const DATA_FILE = "data.json";


const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
const saveData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));


const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  
  if (req.url === "/" && req.method === "GET") {
    const htmlPath = path.join(__dirname, "index.html");
    const htmlContent = fs.readFileSync(htmlPath, "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(htmlContent);
    return;
  }

  if (req.url === "/script.js" && req.method === "GET") {
    const jsPath = path.join(__dirname, "script.js");
    const jsContent = fs.readFileSync(jsPath, "utf-8");
    res.writeHead(200, { "Content-Type": "application/javascript" });
    res.end(jsContent);
    return;
  }

  if (req.url === "/style.css" && req.method === "GET") {
    const cssPath = path.join(__dirname, "style.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");
    res.writeHead(200, { "Content-Type": "text/css" });
    res.end(cssContent);
    return;
  }

  
  if (req.method === "GET" && req.url === "/notas") {
    const notas = readData();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(notas));
    return;
  }

 
  if (req.method === "POST" && req.url === "/notas") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const novaNota = JSON.parse(body);
      const notas = readData();
      novaNota.id = notas.length ? notas[notas.length - 1].id + 1 : 1;
      notas.push(novaNota);
      saveData(notas);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Nota adicionada com sucesso!" }));
    });
    return;
  }

 
  if (req.method === "DELETE" && req.url.startsWith("/notas/")) {
    const id = parseInt(req.url.split("/")[2]);
    const notas = readData();
    const index = notas.findIndex((nota) => nota.id === id);

    if (index !== -1) {
      notas.splice(index, 1);
      saveData(notas);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Nota deletada com sucesso!" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Nota não encontrada!" }));
    }
    return;
  }

  
  if (req.method === "PUT" && req.url.startsWith("/notas/")) {
    const id = parseInt(req.url.split("/")[2]);
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const { texto } = JSON.parse(body);
      const notas = readData();
      const index = notas.findIndex((nota) => nota.id === id);

      if (index !== -1) {
        notas[index].texto = texto;
        saveData(notas);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Nota atualizada com sucesso!" }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Nota não encontrada!" }));
      }
    });
    return;
  }

  
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Rota não encontrada!" }));
});


server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
