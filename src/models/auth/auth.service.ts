const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AuthService {
    // async register(username: string, password: string) {
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     const user = await prisma.user.create({
    //         data: {
    //             username,
    //             password: hashedPassword,
    //         },
    //     });
    //     return user;
    // }

    // async login(username: string, password: string) {
    //     const user = await prisma.user.findUnique({ where: { username } });
    //     if (!user) {
    //         throw new Error('User not found');
    //     }
    //     const isPasswordValid = await bcrypt.compare(password, user.password);
    //     if (!isPasswordValid) {
    //         throw new Error('Invalid password');
    //     }
    //     const token = jwt.sign({ userId: user.id }, 'secret');
    //     return { token };
    // }

    async register(payload: any) {
        const {email, password, role} = payload;
    }
}



