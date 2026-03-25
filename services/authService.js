require('dotenv').config()
const { OAuth2Client} = require('google-auth-library')
const jwt = require('jsonwebtoken')

class AuthService {
    static #clientId = process.env.CLIENT_ID
    static #clientSecret = process.env.CLIENT_SECRET
    static #redirectUri = process.env.REDIRECT_URI
    static #client = new OAuth2Client(this.#clientId, this.#clientSecret, 'http://localhost:4200/callback')
    static #ticket

    static async verifyGoogleWithCode(code, code_verifier) {
        try {
            const { tokens } = await this.#client.getToken({
                code,
                client_id: this.#clientId,
                client_secret: this.#clientSecret,
                redirect_uri: 'http://localhost:4200/callback',
                codeVerifier: code_verifier
            })
            this.#client.setCredentials(tokens)

            if (!tokens.id_token) {
                throw new Error("ID token missing.")
            }

            this.#ticket = await this.#client.verifyIdToken({
                idToken: tokens.id_token,
                audience: this.#clientId
            })

            const payload = this.#ticket.getPayload()

            return payload
        } catch (error) {
            console.error("Google verification error:", error)
            throw error
        }
    }

    verifyFacebook() {
        
    }

    static signJWT(_id, email, name, profilePicture) {
        try {
            return jwt.sign({_id, email, name, profilePicture}, process.env.JWT_SECRET)
        } catch (error) {
            console.log("JWT creation failed: ", error)
        }
    }
}

module.exports = AuthService