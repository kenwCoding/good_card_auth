import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './src/routes';
import { corsConfig } from './src/utils/constants';

dotenv.config();

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsConfig))
app.use(cookieParser());

mongoose.connect(`mongodb://root:password@localhost:27018`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'good_card',
    autoIndex: true,
})

app.use('/', router)

app.use(express.static('public'));

const server = app.listen(3002, function () {
    const port = server.address().port
    console.log(`Listioning to Server http://localhost:${[port]}`)
})