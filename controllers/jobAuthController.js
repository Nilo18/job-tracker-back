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
        const stdProvider = provider.trim().toLowerCase()
        if (stdProvider === 'google') {
            const payload = await AuthService.verifyGoogleWithCode(code, code_verifier)
            userInfo = payload
        } else {
            return res.status(400).json({status: 400, message: "Unsupported provider."})
        }

        userInfo.provider = provider.trim().toLowerCase()
        let user = await User.findOne({[`providers.${userInfo.provider}.id`]: userInfo.sub})

        // Email as a fallback
        if (!user) {
            user = await User.findOne({email: userInfo.email})
        }

        // If the user was not found by email as well, add them, otherwise attach the new provider
        if (!user) {
            // Add user to the database and then send the token
            const newUser = await User.create({
                email: userInfo.email, 
                name: userInfo.name, 
                profilePicture: userInfo.picture,
                emailVerified: userInfo.emailVerified,
                providers: {
                    google: {id: userInfo.sub}
                }
            })
            user = newUser;
        } else if (!user.providers[userInfo.provider]) {
            user.providers[userInfo.provider] = {id: userInfo.sub}
            await user.save()
        }

        const token = AuthService.signJWT(user._id, user.email, user.name, user.profilePicture)
        return res.status(200).json({status: 200, token: token})
    } catch (error) {
        return res.status(500).json({status: 500, message: error.message})
    }
}

async function loginWithFacebook() {
    try {
        
    } catch (error) {
        
    }
}

module.exports = { login }