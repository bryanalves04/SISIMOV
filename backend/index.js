const express = require('express'); // importa o Express
const sqlite3 = require('sqlite3').verbose(); // importa o SQLite
const cors = require('cors'); // importa o CORS

const app = express(); // cria o servidor Express
app.use(cors()); // habilita o CORS
app.use(express.json()); // permite receber dados em JSON
console.log('Servidor Express inicializado.');
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Cria/conecta ao banco de dados SQLite (arquivo sisimov.db)
const db = new sqlite3.Database('./sisimov.db');

// Cria a tabela movimentacoes se não existir
db.run(`CREATE TABLE IF NOT EXISTS movimentacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cpf TEXT,
  origem TEXT,
  destino TEXT,
  data TEXT,
  status TEXT
)`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela movimentacoes:', err.message);
  } else {
    console.log('Tabela movimentacoes criada ou já existe.');
  }
});

// Rota GET para listar movimentações
app.get('/movimentacoes', (req, res) => {
  db.all('SELECT * FROM movimentacoes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Rota POST para cadastrar movimentação
app.post('/movimentacoes', (req, res) => {
  const { cpf, origem, destino, data, status } = req.body;
  console.log('Recebendo movimentação:', req.body);
  db.run(
    'INSERT INTO movimentacoes (cpf, origem, destino, data, status) VALUES (?, ?, ?, ?, ?)',
    [cpf, origem, destino, data, status],
    function(err) {
      if (err) {
        console.error('Erro ao inserir movimentação:', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log('Movimentação inserida com sucesso:', { id: this.lastID, cpf, origem, destino, data, status });
      res.json({ id: this.lastID, cpf, origem, destino, data, status });
    }
  );
});

// Inicia o servidor na porta 3001
app.listen(3001, () => {
  console.log('Backend rodando na porta 3001');
});