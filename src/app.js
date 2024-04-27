import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet";

dotenv.config()

const app = express();


// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(helmet())

// Test route
app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' })
})


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🎉 Server is live on https://localhost:${PORT}`)
})