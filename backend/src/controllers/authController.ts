import { Request, Response } from 'express';
import User from '../models/User';  // Assume you have a User model created
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // You need to install this

// User Registration
export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
        username,
        password: hashedPassword
    });
    
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// User Login
export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        // Generate token
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};