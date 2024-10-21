import mongoose, { Schema } from "mongoose";
const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
const Admin = mongoose.model("Admin", adminSchema, "admins");
export default Admin;
