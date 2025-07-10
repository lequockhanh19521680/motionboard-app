import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '@domain/repositories/IUserRepository';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    image?: string;
    phone?: string;
    isDeleted: boolean;
    createdAt: Date;
  };
  token: string;
}

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const { username, password } = request;

    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      user: user.toSafeUser(),
      token
    };
  }
}