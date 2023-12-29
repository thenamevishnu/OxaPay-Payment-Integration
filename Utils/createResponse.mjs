export const createResponse = (res, statusCode, message, result = null) => {
    res.status(statusCode).send(
        {
            message: message,
            result: result
        }
    )
}