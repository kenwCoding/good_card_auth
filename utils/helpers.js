import jwt from 'jsonwebtoken';
import { UserModel } from '../models';
import { ACCESS_TOKEN_TIME, REFRESH_TOKEN_TIME } from './constants';

const updateRefreshToken = async (payload) => {
    const {username, role, provider} = payload

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: `${REFRESH_TOKEN_TIME}s`})
    
    const curTime = new Date()
    payload['refreshToken'] = refreshToken
    payload['updatedAt'] = curTime
    payload['lastLoginedAt'] = curTime

    const user = await UserModel.findOne({
        username: username,
        role: role,
        provider: provider,
    }).updateOne(payload)

    return refreshToken
}

const createAccessToken = async (payload, refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const {username, role, provider} = decoded

    if (!username || !role || !provider) {
        throw new Error('Refresh Token payload not found')
    }

    const user = await UserModel.findOne({
        username: username,
        role: role,
        provider: provider,
        refreshToken: refreshToken
    })
    
    if (!user) {
        throw new Error('User not found with refresh token')
    }
    
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: `${ACCESS_TOKEN_TIME}s`})
    return accessToken
}

export {
    updateRefreshToken,
    createAccessToken
}