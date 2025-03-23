import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: String,
    email: String,
    password: String
});

export const User = mongoose.model('user', userSchema);

const todoSchema = new Schema({
    todo: String,
    done: {type: Boolean, default: false},
    user: {type: mongoose.Types.ObjectId, ref: User}
});

export const Todo = mongoose.model('todos', todoSchema);

