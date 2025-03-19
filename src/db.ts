import mongoose, { Schema } from "mongoose";
require('dotenv').config();
mongoose.connect(process.env.DATABASE_URL as string);

const userSchema = new Schema({
    name: String,
    email: String,
    password: String
});

export const User = mongoose.model('user', userSchema);

const todoSchema = new Schema({
    todo: String,
    done: Boolean,
    user: {type: mongoose.Types.ObjectId, ref: User}
});

export const Todo = mongoose.model('todos', todoSchema);

