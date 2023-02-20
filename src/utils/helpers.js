import jwt from 'jsonwebtoken';
import { UserModel } from '../models';
import { ACCESS_TOKEN_TIME, REFRESH_TOKEN_TIME } from './constants';

/** NOTE: Update Refresh Token
 * @param username
 * @param role
 * @param provider
 * @param userId
 * @returns {refreshToken}
 * @summary: Get Refresh Token by username, role and provider
 */
const updateRefreshToken = async (payload) => {
    try{
        const {username, role, provider, userId} = payload
        const userInfo = {username, role, provider, userId}

        const refreshToken = jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET, {expiresIn: `${REFRESH_TOKEN_TIME}s`})
        
        const curTime = new Date()
        userInfo['refreshToken'] = refreshToken
        userInfo['updatedAt'] = curTime
        userInfo['lastLoginedAt'] = curTime
    
        const user = await UserModel.findOne({
            _id: userId,
            username: username,
            role: role,
            provider: provider,
        }).updateOne(userInfo)
    
        if (!user) {
            throw new Error('User not found with payload')
        }
    
        console.log('Updated Refresh Token');
    
        return refreshToken
    } catch (e) {
        console.log(e);
    }
}

/** NOTE: Update Access Token
 * @param refreshToken
 * @returns {accessToken}
 * @summary: Get new Access Token by refresh token
 */
const updateAccessToken = async (refreshToken) => {
    // Validate Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
        if (err) {
            throw new Error(err.message)
        }
        return decode
    });

    // Retrive decoded payload
    const {username, role, provider, userId} = decoded

    // Check if payload is valid
    if (!username || !role || !provider || !userId) {
        throw new Error('Refresh Token payload not found')
    }

    const payload = {
        _id: userId,
        username: username,
        role: role,
        provider: provider,
    }

    // Check if user is exist with same payload
    const user = await UserModel.findOne({
        ...payload,
        refreshToken: refreshToken
    })
    
    // throw error if not exist
    if (!user) {
        throw new Error('User not found with refresh token')
    }

    // sign a new access token
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: `${ACCESS_TOKEN_TIME}s`})

    console.log('Refreshed Access Token');

    return accessToken   
}

export {
    updateRefreshToken,
    updateAccessToken
}