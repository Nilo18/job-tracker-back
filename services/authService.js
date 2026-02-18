// require('dotenv').config()
const { OAuth2Client} = require('google-auth-library')
const jwt = require('jsonwebtoken')

class AuthService {
    static #clientId = process.env.CLIENT_ID
    static #clientSecret = process.env.CLIENT_SECRET
    static #redirectUri = process.env.REDIRECT_URI
    static #client = new OAuth2Client(this.#clientId, this.#clientSecret, this.#redirectUri)
    static #ticket

    static async verifyGoogleWithCode(code, code_verifier) {
        try {
            console.log("code is: ", code, "\n\n\n")
            console.log("code_verifier is: ", code_verifier, "\n\n\n")
            const { tokens } = await this.#client.getToken({
                code,
                client_id: this.#clientId,
                client_secret: this.#clientSecret,
                redirect_uri: this.#redirectUri,
                codeVerifier: code_verifier
            })
            this.#client.setCredentials(tokens)
            console.log("Received tokens: ", tokens)
            console.log("The id_token is: ", tokens.id_token)

            if (!tokens.id_token) {
                console.log('No ID token returned from Google');
                throw new Error("ID token missing.")
            }

            this.#ticket = await this.#client.verifyIdToken({
                idToken: tokens.id_token,
                audience: this.#clientId
            })

            const payload = this.#ticket.getPayload()

            console.log("The received payload is: ", payload)

            return payload
        } catch (error) {
            console.log("Failed to verify code: ", error)
        }
    }

    static signJWT(email, name, profilePicture) {
        try {
            return jwt.sign({email, name, profilePicture}, process.env.JWT_SECRET)
        } catch (error) {
            console.log("JWT creation failed: ", error)
        }
    }
}

module.exports = AuthService