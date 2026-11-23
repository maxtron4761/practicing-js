import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 1,
            maxlength: 30
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Before saving any password we need to hash it
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return typeof next === "function" ? next() : undefined;

    this.password = await bcrypt.hash(this.password, 10);
    if (typeof next === "function") next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
export default User;
