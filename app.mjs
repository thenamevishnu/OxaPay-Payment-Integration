import express from "express"
import env from "dotenv"

env.config()

const app = express()

app.listen(process.env.PORT || 8080, () => {
    console.log("Server running on port", process.env.PORT || 8080)
})