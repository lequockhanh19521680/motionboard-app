import { User } from 'entities/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRepository } from 'repositories/user.repository';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthUseCase {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository();
    }

    async login({ username, password }: { username: string, password: string }) {
        const user: User | null = await this.userRepo.findByUsername(username);
        if (!user) throw new Error("User not found");
        if (!user.password) throw new Error("Invalid user data");

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error("Invalid credentials");

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const { password: pwd, ...publicUser } = user as any;

        return { user: publicUser, token };
    }
}
