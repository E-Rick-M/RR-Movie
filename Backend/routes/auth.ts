import express, { type NextFunction ,type Request,type Response  } from 'express';

// Extend the Request interface to include the 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const router = express.Router();

const prisma = new PrismaClient();


router.post('/signup', async(req, res) => {
    const { email, password } = req.body;

    const errors: Partial<{ email: string; password: string }> = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (password && password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Email is not valid";
    }
    if (email.trim() === "") {
        errors.email = "Email is required";
    }
    if (password.trim() === "") {
        errors.password = "Password is required";
    }
    if (Object.keys(errors).length > 0) {
        res.status(400).json({ errors });
    }

    if (!process.env.JWT_SECRET) {
        res.status(500).json({ message: "JWT_SECRET is not defined in environment variables" });
        return
    }
    const hashedPassword =await bcrypt.hash(password, 10);

    const user=await prisma.user.create({
        data:{
            email,
            password: hashedPassword,
            name: email.split('@')[0],
        }
    })

    if (!user) {
        res.status(400).json({ message: "User already exists" });
        return
    }
 
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    // res.cookie('token', token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
    //     sameSite: 'strict', // Adjust as needed
    //     maxAge: 3600000, // 1 hour
    // });



    res.status(200).json({ message: "User created successfully",token });
}
);


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const errors: Partial<{ email: string; password: string }> = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if(email.trim() === "") {
        errors.email = "Email is required";
    }

    if (Object.keys(errors).length > 0) {
        res.status(400).json({ errors });
    }
    if (!process.env.JWT_SECRET) {
        res.status(500).json({ message: "JWT_SECRET is not defined in environment variables" });
        return
    }

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user || !user.password) {
        res.status(400).json({ message: "User not found" });
        return
    }
    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(400).json({ message: "Invalid password" });
        return
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    res.status(200).json({ message: "Login successful", token });
}
);


export function authenticate(req :Request, res :Response,next :NextFunction){
   const authHeader = req.headers.authorization

    if (!authHeader) {
        res.status(401).json({ message: 'Authorization header is missing' });
        return;
    }

    const token = authHeader.split(' ')[1];

    if(!process.env.JWT_SECRET){
        res.status(500).json({ message: "JWT_SECRET is not defined in environment variables" });
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }


}


export default router;