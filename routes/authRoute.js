import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models';
import { createAccessToken, updateRefreshToken } from '../utils/helpers';
const authRouter = express.Router();

const ACCESS_TOKEN_TIME = 200
const REFRESH_TOKEN_TIME = 300

/* Get Refresh Token */

/* Login */
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
            const refreshToken = await updateRefreshToken(payload)
            const accessToken = await createAccessToken(payload, refreshToken)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: REFRESH_TOKEN_TIME * 1000
            })

            return res.status(200).json({ accessToken })
        } else {
            return res.status(403).json({message: 'Unauthorized'})
        }

    } catch (e) {
        console.error('Unable to create user: ', e);
        return res.status(400).json(e)
    }
})

/* Create User */
authRouter.post('/', async (req, res, next) => {
    try {
        
    } catch (e) {
        console.error('Unable to create user: ', e);
        return res.status(400).json(e)
    }
})

/* Check AccessToken */
authRouter.post('/check', async (req, res, next) => {
    try {
        const { body } = req

        if (!body?.accessToken){
            throw new Error('Missing Access Token')
        }

        const decoded = jwt.verify(body.accessToken, process.env.ACCESS_TOKEN_SECRET)

        if (!decoded) {
            throw new Error('Access Token is not valid')
        }

        return res.status(200).json({message: 'success'})
    } catch (e) {
        console.error(e);
        return res.status(400).json({message: e.message})
    }
})
export { authRouter };
