import express from "express"
import env from "dotenv"
import paymentRoute from "./Routes/payment.route.mjs"

env.config()

const app = express()

app.use(express.json())
app.use("/", paymentRoute)

app.listen(process.env.PORT || 8080, () => {
    console.log("Server running on port", process.env.PORT || 8080)
})