import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: String,
    email: String,
    password: String
});

export const User = mongoose.model('user', userSchema);

const todoSchema = new Schema({
    todo: String,
    description: String,
    done: {type: Boolean, default: false},
    user: {type: Schema.Types.ObjectId, ref: "user"}
});

export const Todo = mongoose.model('todos', todoSchema);

const sharedTodoSchema = new Schema({
    todo: String,
    description: String,
    done: {type: Boolean, default: false},
    user: {type: Schema.Types.ObjectId, ref: "user"},
    sharedUser: {type: Schema.Types.ObjectId, ref: "project"}
});

export const SharedTodo = mongoose.model('sharedtodos', sharedTodoSchema);

const sharedProjectSchema = new Schema({
    project: String,
    sharedUser: String,
    user: {type: Schema.Types.ObjectId, ref: "user"},

})

export const Project = mongoose.model('projects', sharedProjectSchema)

