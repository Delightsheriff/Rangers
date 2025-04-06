import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { SignUpDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { UserRepository } from 'src/infrastructure/orm/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signup(signUpDto: SignUpDto) {
    const { first_name, last_name, email, password } = signUpDto;
    if (!first_name || !last_name) {
      throw new BadRequestException('First name and last name are required');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      firstName: first_name,
      lastName: last_name,
      email,
      password: hashedPassword,
    });

    const token = this.generateToken(user.id);
    return { user, token };
  }

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;
    const user = await this.userRepository.findByIdentifier(identifier);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    return { user, token };
  }

  private generateToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h',
    });
  }
}
