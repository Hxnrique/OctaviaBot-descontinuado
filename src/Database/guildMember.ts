import { Schema, model } from "mongoose";

export default model("guildMembers", new Schema({
    userID: {
        type: String
    },
    guildID: {
        type: String
    }
}))