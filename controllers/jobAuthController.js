const User = require('../models/user.model.js')
const AuthService = require('../services/authService.js')

async function login(req, res, next) {
    try {
        const { provider, code, code_verifier } = req.body

        if (!provider) {
            return res.status(400).json({status: 400, message: "Please specify a provider"})
        }

        if (!code) {
            return res.status(400).json({status: 400, message: "Please provide a code"})
        }

        if (!code_verifier) {
            return res.status(400).json({status: 400, message: "Please provide a code verifier"})
        }

        let userInfo
        if (provider.trim().toLowerCase() === 'google') {
            const payload = await AuthService.verifyGoogleWithCode(code, code_verifier)
            console.log('Received the payload from the googleIdToken checker method: ', payload)
            userInfo = payload
        } else {
            return res.status(400).json({status: 400, message: "Unsupported provider."})
        }

        console.log("userInfo is: ", userInfo)
        const user = await User.findOne({email: userInfo.email})
        const token = AuthService.signJWT(userInfo.email, userInfo.name, userInfo.picture)
        // console.log("The custom token is: ", token)
        if (!user) {
            // Add user to the database and then send the token
            return res.status(401).json({ status: 401, message: 'User not registered' })
        }

        return res.status(200).json({status: 200, token: token})

    } catch (error) {
        console.log("Couldn't log in: ", error)
        return res.status(500).json({status: 500, message: error.message})
    }
}

module.exports = { login }