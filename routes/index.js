import express from 'express';
import { authRouter } from './authRoute';

const router = express.Router()

router.get('/', function (req, res) {
    res.send('Auth Server Health check success.');
})

router.use('/auth', authRouter)

export default router

