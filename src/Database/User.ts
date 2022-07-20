import { Schema, model } from "mongoose";

export default model("users", new Schema({
    userID: {
        type: String,
    }
}))