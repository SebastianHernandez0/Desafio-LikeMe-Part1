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
        console.log("hay un errer", error.message)
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

app.put("/posts/like/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const query = "UPDATE posts SET likes = COALESCE(likes, 0) +1 WHERE id = $1";
        const values = [id]
        const { rows } = await pool.query(query, values)
        res.json("post actualizado con exito")
    } catch (error) {
        console.log("hay un error", error.message)
    }

})

app.delete("/posts/:id", async (req, res) => {
    try {
        const postId = req.params.id;
        const query = "DELETE FROM posts WHERE id = $1"
        const values = [postId]
        const { rows } = await pool.query(query, values)
        res.json("post eliminado con exito")
    } catch (error) {
        console.log("hay un error", error.message)
    }
})