import {
  Injectable,
  UnauthorizedException,
  NotAcceptableException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { SignUpDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { UserRepository } from 'src/infrastructure/orm/repositories/user.repository';
import { JWT_SECRET } from 'src/config';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signup(signUpDto: SignUpDto) {
    const { firstName, lastName, email, password } = signUpDto;

    const userEmail = await this.userRepository.findByEmail(email);

    if (userEmail) throw new NotAcceptableException('Email in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = this.generateToken(user.id);
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        username: user.username,
        phone: user.phone,
        gender: user.gender,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;
    const user = await this.userRepository.findByIdentifier(identifier);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        username: user.username,
        phone: user.phone,
        gender: user.gender,
      },
      token,
    };
  }

  private generateToken(userId: string) {
    return jwt.sign({ userId }, JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h',
    });
  }
}
