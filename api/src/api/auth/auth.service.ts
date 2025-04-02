import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from '../../infrastructure/orm/entities/user.entity'; 
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { SignUpDto } from './signup.dto'
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserEntity)
    private userModel: typeof UserEntity,
  ) {}

  async signup(SignUpDto: any) {
    const { first_name, last_name, email, password } = SignUpDto;
    if (!first_name || !last_name) {
        throw new BadRequestException('First name and last name are required');
      }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.userModel.create({
      firstName: first_name,
      lastName: last_name,
      email,
      password: hashedPassword
    });

    const token = this.generateToken(Number(user.id));
    return { user, token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({
      where: { email: loginDto.email },
    });

    if (!user || !await bcrypt.compare(loginDto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(Number(user.id));
    return { user, token };
  }

  private generateToken(userId: number) {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h',
    });
  }
}