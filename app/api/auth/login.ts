import {db} from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';


const SECRET_KEY = process.env.SECRET_KEY;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, password } = body;
        if (!username || !password) {
            return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
        }
        let rows;
        
        rows = await db('SELECT * FROM USERS WHERE LOWER(username) = LOWER($1)', [username]);
           
        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
        }
        const user = rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ error: 'Incorrect password' }, { status: 400 });
        }
        if (!SECRET_KEY) {
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
        const token = jwt.sign({ userId: user.id },SECRET_KEY,{ expiresIn: '1h' });
        
        return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}