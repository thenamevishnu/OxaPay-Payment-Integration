import axios from "axios"

export const createPaymentLink = async (merchant_apiKey, unique_id, amount, callbackUrl, currency) => {
    
    const orderId = `${Math.floor(new Date().getTime())}` //Specify a unique order ID for reference in your system
    
    const request_url = `https://api.oxapay.com/merchants/request`
    
    const body = JSON.stringify(
        {
            merchant: merchant_apiKey,
            amount: amount,
            currency: currency,
            lifeTime: 30,
            feePaidByPayer: 0,
            underPaidCover: 2.5,
            callbackUrl: callbackUrl,
            description: unique_id,
            orderId: orderId,
        }
    )

    const { data: response } = await axios.post(request_url, body)

    return response
}