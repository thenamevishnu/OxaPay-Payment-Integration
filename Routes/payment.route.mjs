import { Router } from "express"
import paymentController from "../Controller/payment.controller.mjs"

const app = Router()

app.get("/api/status", paymentController.status)
app.get("/api/invoice/create", paymentController.createInvoice)
app.get("/api/payout/create", paymentController.createWithdrawal)
app.post("/api/payment/callback", paymentController.callbackTransaction)

export default app