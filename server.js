const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT; 

// Chave secreta para assinatura do JWT
const SECRET_KEY = 'YOUR_SUPER_SECRET_KEY'; // Você deve substituir isso por uma chave mais segura

// Configuração do banco de dados
const dbConfig = {
  user: 'danielcortez',
  password: 'nega12345*',
  server: 'dbserver-inteligym.database.windows.net',
  database: 'DataBase-Inteligym',
  options: {
    encrypt: true
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para verificar JWT
app.use((req, res, next) => {
  if (req.path === '/login') { // Permitir que o endpoint de login passe sem verificação
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: 'No token provided' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).send({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Token invalid' });

    req.userId = decoded.id;
    return next();
  });
});

// Endpoint de login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('inputEmail', sql.NVarChar, email)
      .input('inputPassword', sql.NVarChar, password)
      .query('SELECT * FROM Usuarios WHERE email = @inputEmail AND senha = @inputPassword');

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login bem-sucedido!', token: token, userId: user.id });
    } else {
      res.status(401).json({ message: 'Email ou senha inválidos!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

app.put('/updateGender/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { gender } = req.body;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('inputGender', sql.NVarChar, gender)
      .input('inputUserId', sql.Int, userId)
      .query('UPDATE Usuarios SET gender = @inputGender WHERE id = @inputUserId');

    res.status(200).json({ message: 'Gênero atualizado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o gênero.' });
  }
});

app.put('/updateAge/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { age } = req.body;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('inputAge', sql.Int, age)
      .input('inputUserId', sql.Int, userId)
      .query('UPDATE Usuarios SET age = @inputAge WHERE id = @inputUserId');

    res.status(200).json({ message: 'Idade atualizada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar a idade.' });
  }
});

app.put('/updateWeight/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { weight } = req.body;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('inputWeight', sql.Int, weight)
      .input('inputUserId', sql.Int, userId)
      .query('UPDATE Usuarios SET weight = @inputWeight WHERE id = @inputUserId');

    res.status(200).json({ message: 'Peso atualizado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o peso.' });
  }
});

app.put('/updateHeight/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { height } = req.body;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('inputHeight', sql.Int, height)
      .input('inputUserId', sql.Int, userId)
      .query('UPDATE Usuarios SET height = @inputHeight WHERE id = @inputUserId');

    res.status(200).json({ message: 'Altura atualizada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar a altura.' });
  }
});

app.put('/updateGoal/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { goal } = req.body;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('inputGoal', sql.NVarChar, goal)
      .input('inputUserId', sql.Int, userId)
      .query('UPDATE Usuarios SET goal = @inputGoal WHERE id = @inputUserId');

    res.status(200).json({ message: 'Objetivo atualizado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o objetivo.' });
  }
});

app.put('/updateLevel/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { level } = req.body;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('inputLevel', sql.NVarChar, level)
      .input('inputUserId', sql.Int, userId)
      .query('UPDATE Usuarios SET level = @inputLevel WHERE id = @inputUserId');

    res.status(200).json({ message: 'Nível atualizado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o nível.' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
