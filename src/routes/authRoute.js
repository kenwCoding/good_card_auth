import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models';
import { updateAccessToken, updateRefreshToken } from '../utils/helpers';

const authRouter = express.Router();

/* Get Refresh Token */

/** NOTE: Login
 * @param username
 * @param password
 * @param role
 * @param provider
 * @returns {refreshToken, accessToken, userInfo}
 * @summary: Login to generate new access token and refresh token for backend server use
 */
authRouter.post('/login', async (req, res, next) => {
    try {
        const { username, password, role, provider } = req.body
        
        const payload = { 
            username: username,
            role: role,
            provider: provider
        }
        
        const user = await UserModel.findOne({ payload })

        if (!user) {
            console.log('User Not Found');
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const isPasswordValid = await argon2.verify(user.password, password)
        
        if (isPasswordValid) {
            payload['userId'] = user._id.valueOf()
            const refreshToken = await updateRefreshToken(payload)
            const accessToken = await updateAccessToken(refreshToken)

            return res.status(200).json({refreshToken, accessToken, userInfo: payload})
        } else {
            return res.status(403).json({message: 'Unauthorized'})
        }
    } catch (e) {
        console.error('Unable to login: ', e);
        return res.status(403).json({message: e.message})
    }
})

/** NOTE: Check Access Token
 * @param accessToken
 * @returns {message, userInfo}
 * @summary: Check Access Token and return userInfo
 */
authRouter.post('/check', async (req, res, next) => {
    try {
        const { accessToken } = req.body

        if (!accessToken) {
            return res.status(403).json({message: 'Missing Access Token, Please login again.'})
        }

        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
            if (err) {
                throw new Error(err.message)
            }
            return decode
        })

        if (!payload) {
            return res.status(403).json({message: 'Access Token Expired, Please refresh the token.'})
        }

        return res.status(200).json({message: 'Authorised', userInfo: payload})
    } catch (e) {
        console.error(e.message);

        if (e.message === 'jwt expired') {
            console.log('access expired');
            return res.status(403).json({message: 'access token expired'})
        }

        return res.status(400).json({message: e.message})
    }
})

/** NOTE: Refresh Access Token
 * @param refreshToken
 * @returns {accessToken, userInfo}
 * @summary: Refresh Access Token and return userInfo
 */
authRouter.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(400).json({message: 'Missing Refresh Token Token, Please login again.'})
        }

        const accessToken = await updateAccessToken(refreshToken)

        if (!accessToken) {
            return res.status(403).json({message: 'Access Token Expired, Please refresh the token.'})
        }

        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        return res.status(200).json({ accessToken, userInfo: payload})
    } catch (e) {
        console.error(e.message);

        if (e.message === 'jwt expired') {
            console.log('refresh expired');
            return res.status(403).json({message: 'refresh token expired'})
        }

        return res.status(400).json({message: e.message})
    }
})
export { authRouter };
