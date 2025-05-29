import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import expressAsyncHandler from 'express-async-handler';

interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
    };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const register = expressAsyncHandler(async (req: Request, res: Response) => {
    const { firstname, lastname, middlename, email, password } = req.body;

    //   if(!firstname || !lastname || !email || !password) {
    //     res.status(400).json({ message: 'All fields are required.' });
    //     return;
    //   }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400).json({ message: 'Email already in use.' });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        firstname,
        lastname,
        middlename,
        email,
        password: hashedPassword,
    });

    await newUser.save();
    const payload = { userId: newUser._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User registered successfully.', token });
});

export const login = expressAsyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'All fields are required.' });
        return;
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400).json({ message: 'Invalid credentials.' });
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400).json({ message: 'Invalid credentials.' });
        return;
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            balance: user.balance,
        },
    });
});

export const setPin = expressAsyncHandler(async (req: Request, res: Response) => {
    const { pin } = req.body;
    const authReq = req as AuthenticatedRequest;

    if (!pin) {
        res.status(400).json({ message: 'Pin is required.' });
        return;
    }

    if (!/^\d{4,6}$/.test(pin)) {
        res.status(400).json({ message: 'Pin must be 4 to 6 digits.' });
        return;
    }

    const user = await User.findById(authReq.user.userId);
    if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);
    user.pin = parseInt(pin);
    await user.save();

    res.status(200).json({ message: 'Pin set successfully.' });
});

