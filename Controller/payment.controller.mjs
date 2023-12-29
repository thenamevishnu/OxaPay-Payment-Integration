import { createPaymentLink } from "../Utils/OxaPay.mjs"
import { createResponse } from "../Utils/createResponse.mjs"
import env from "dotenv"

env.config()

const status = async (req, res) => {
    try {
        return createResponse(res, 200, "up", {ok: true, message: "UP"})
    } catch (err){
        return createResponse(res, 500, "down", {ok: false, message: "DOWN"})
    }
}

const createInvoice = async (req, res) => {
    try {
        const merchant_apiKey = process.env.MERCHANT_APIKEY
        const user_identifier = "23234" //unique ID for identify the user
        const currency = "USDT" //currency symbol (crypto)
        const amount = 10 //amount in {currency}
        const callbackUrl = `http://localhost:8080/api/payment/callback` //Replace example.com to your hostname

        const response = await createPaymentLink(
            merchant_apiKey,
            user_identifier,
            amount,
            callbackUrl,
            currency
        )

        if (response.result == 100 && response.message == "success") {
            return createResponse(res, 201, "Created", { ...response, ok: true })
        }

        return createResponse(res, 500, 'Failed', {...response, ok: false}) 
    } catch (err) {
        return createResponse(res, 500, "Internal server error", {ok: false})
    }
}

const callbackTransaction = async (req, res) => {
    try {
        const body = req.body
        const MERCHANT_APIKEY = process.env.MERCHANT_APIKEY
        const hmacHeader = req.headers['hmac']
        const calculatedHmac = crypto.createHmac("sha512", MERCHANT_APIKEY).update(JSON.stringify(body)).digest("hex")
        if (calculatedHmac === hmacHeader) {
            if (postData.type === "payment") {
                
                if (status === "Waiting") {
                    // Payer selected the payment currency and geting address. Awaiting payment.
                }
                if (status === "Confirming") {
                    // Payer transferred the payment for the invoice. Awaiting blockchain network confirmation.
                }
                if (status === "Paid") {
                    // Payment is confirmed by the network and has been credited to the merchant. Purchased goods/services can be safely delivered to the payer.
                }
            }
        } else {
            return createResponse(res, 400, "Invalid HMAC signature", {ok: false})
        }
    } catch (err) {
        return createResponse(res, 500, "Internal server error", {ok: false})
    }
}

export default {
    status,
    createInvoice,
    callbackTransaction
}