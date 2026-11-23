import User from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: "all fields are important" });
        }

        // Check if user already exists
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: "user already exists" });
        }

        // Create user
        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password
        });

        return res.status(201).json({
            message: "user registered",
            id: user._id,
            email: user.email,
            username: user.username
        });
    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "invalid credentials" });
        }

        return res.status(200).json({
            message: "user logged in",
            id: user._id,
            email: user.email,
            username: user.username
        });
    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        return res.status(200).json({ message: "logout successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        });
    }
};

export { registerUser, loginUser, logoutUser };
