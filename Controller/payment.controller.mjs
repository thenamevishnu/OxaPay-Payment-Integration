import { createPaymentLink, createPayout } from "../Utils/OxaPay.mjs"
import { createResponse } from "../Utils/createResponse.mjs"
import env from "dotenv"

env.config()

const status = async (req, res) => {
    try {
        return createResponse(res, 200, "up", {message: "UP"})
    } catch (err){
        return createResponse(res, 500, "down", {message: "DOWN"})
    }
}

const createInvoice = async (req, res) => {
    try {
        const merchant_apiKey = process.env.MERCHANT_APIKEY
        const user_identifier = "23234" //unique ID for identify the user
        const currency = "USDT" //currency symbol (crypto)
        const amount = 10 //amount in {currency}
        const callbackUrl = `http://localhost:8080/api/payment/callback` //Replace http://localhost:8080 to your origin

        const response = await createPaymentLink(
            merchant_apiKey,
            user_identifier,
            amount,
            callbackUrl,
            currency
        )

        return createResponse(res, 200, "Response", response)
    
    } catch (err) {
        return createResponse(res, 500, "Internal server error")
    }
}

const createWithdrawal = async (req, res) => {
    try {
        const payout_apiKey = process.env.PAYOUT_APIKEY
        const currency = "TRX" //replace with other currency symbol, if you want to change
        const receiver_crypto_address = "TM23AykLjytb8tNC4LCKisdsGzGVHnPcf3" //crypto address of {currency} 
        const amount = "1" //amount
        const callbackUrl = `http://localhost:8080/api/payment/callback` //Replace http://localhost:8080 to your origin

        const response = await createPayout(
            payout_apiKey,
            receiver_crypto_address,
            amount,
            currency,
            callbackUrl
        )

        return createResponse(res, 200, "Response", response)

    } catch (err) {
        
    }
}

const callbackTransaction = async (req, res) => {
    try {
        const body = req.body
        const MERCHANT_APIKEY = process.env.MERCHANT_APIKEY
        const hmacHeader = req.headers['hmac']
        const calculatedHmac = crypto.createHmac("sha512", MERCHANT_APIKEY).update(JSON.stringify(body)).digest("hex")
        if (calculatedHmac === hmacHeader) {
            if (body.type === "payment") {
                //Deposit
                const status = body.status
                if (status === "Waiting") {
                    // Payer selected the payment currency and geting address. Awaiting payment.
                }
                if (status === "Confirming") {
                    // Payer transferred the payment for the invoice. Awaiting blockchain network confirmation.
                }
                if (status === "Paid") {
                    // Payment is confirmed by the network and has been credited to the merchant. Purchased goods/services can be safely delivered to the payer.
                }
            } else if (body.type === "payout") {
                //Withdrawal
                const status = body.status
                if (status === "Confirming") {
                    // You payout request sent and awaiting blockchain network confirmation.
                }
                if (status === "Complete") {
                    // Payout is confirmed by the network.
                }
            }
        } else {
            return createResponse(res, 400, "Invalid HMAC signature")
        }
    } catch (err) {
        return createResponse(res, 500, "Internal server error")
    }
}

export default {
    status,
    createInvoice,
    createWithdrawal,
    callbackTransaction
}