import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        validate: {
            validator: (username) => {
                const regex = /^[a-z][^\W_]{5,20}$/
                return (!username || !username?.trim()?.length) || regex.test(username)
            },
            message: 'Provided username is invalid.'
        },
        required: true,
        unique: true
    },
    password : {
        type: String
    },
    role : {
        type: String,
        required: true
    },
    provider : {
        type: String,
        required: true
    },
    lastLoginedAt : {
        type: Date,
        default: Date.now
    },
    updatedAt : {
        type: Date,
        default: Date.now
    },
    createdAt : {
        type: Date,
        default: Date.now,
        immutable: true
    },
    refreshToken : {
        type: String,
    }
})

const UserModel = mongoose.model("User", userSchema)

export { UserModel }