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

function calculIMC(poids, taille = 1.7) {
    const t = taille || 1.7;
    return (poids / (t * t)).toFixed(2);
}

app.post('/signup', async (req, res) => {
    const { email, password, sexe, age, poids, taille } = req.body;
    try {
        const [result] = await db.query('INSERT INTO users (email, password, sexe, age, taille) VALUES (?, ?, ?, ?, ?)', [email, password, sexe, age, taille]);
        const userId = result.insertId;
        const imc = calculIMC(poids, taille);
        await db.query('INSERT INTO weights (user_id, poids, imc) VALUES (?, ?, ?)', [userId, poids, imc]);
        res.json({ success: true, userId });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, email, sexe, age, taille, date_creation FROM users WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.json({ success: false, message: 'User not found' });
        res.json(rows[0]);
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
    try {
        const [rows] = await db.query('SELECT taille FROM users WHERE id = ?', [userId]);
        const taille = rows[0] ? rows[0].taille : null;
        const imc = calculIMC(poids, taille);
        await db.query('INSERT INTO weights (user_id, poids, imc) VALUES (?, ?, ?)', [userId, poids, imc]);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});
app.delete('/weights/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM weights WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Mesure supprimée avec succès' });
        } else {
            res.json({ success: false, message: 'Mesure non trouvée' });
        }
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});
app.listen(3001, () => console.log('Back-end running on port 3001'));
