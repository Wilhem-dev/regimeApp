const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'regime'
});

function calculIMC(poids) {
    const taille = 1.7; // taille par défaut en mètres
    return (poids / (taille * taille)).toFixed(2);
}

app.post('/signup', async (req, res) => {
    const { email, password, sexe, age, poids } = req.body;
    try {
        const [result] = await db.query('INSERT INTO users (email, password, sexe, age) VALUES (?, ?, ?, ?)', [email, password, sexe, age]);
        const userId = result.insertId;
        const imc = calculIMC(poids);
        await db.query('INSERT INTO weights (user_id, poids, imc) VALUES (?, ?, ?)', [userId, poids, imc]);
        res.json({ success: true, userId });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT id FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length > 0) res.json({ success: true, userId: rows[0].id });
    else res.json({ success: false });
});

app.get('/weights/:userId', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM weights WHERE user_id = ?', [req.params.userId]);
    res.json(rows);
});

app.post('/weights', async (req, res) => {
    const { userId, poids } = req.body;
    const imc = calculIMC(poids);
    await db.query('INSERT INTO weights (user_id, poids, imc) VALUES (?, ?, ?)', [userId, poids, imc]);
    res.json({ success: true });
});

app.listen(3001, () => console.log('Back-end running on port 3001'));
