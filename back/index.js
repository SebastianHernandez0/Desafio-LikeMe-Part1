const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: process.env.PASSWORD,
    database: 'likeme',
    allowExitOnIdle: true
})

const app = express()
//levantamiento del seridor
app.listen(3000, () => console.log("Servidor corriendo en el puerto 3000"))

//middleware
app.use(express.json())
app.use(cors())

//Rutas
app.get("/posts", async (req, res) => {
    try {
        const query = "SELECT * FROM posts;"
        const { rows } = await pool.query(query)
        res.json(rows)
    } catch (error) {
        console.log("hay un error", error.message)
    }
})
app.post("/posts", async (req, res) => {
    try {
        const {titulo, url, descripcion} = req.body
        if (!titulo || !url || !descripcion) {
            console.log("No pueden haber campos vacíos");
            return;
          }


        const id = Math.floor(Math.random() * 9999)
        const query = "INSERT INTO posts (id, titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4, $5)"
        const values = [id, titulo, url, descripcion, 0]
        const { rows } = await pool.query(query, values)
        res.json("post creado con exito")
    } catch (error) {
        console.log("hay un error", error.message)
    }
})