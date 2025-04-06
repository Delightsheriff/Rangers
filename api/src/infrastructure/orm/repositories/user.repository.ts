import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserEntity)
    private readonly userModel: typeof UserEntity,
  ) {}

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    return await this.userModel.create(data);
  }

  async findByIdentifier(identifier: string): Promise<UserEntity | null> {
    return await this.userModel.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { phone: identifier },
          { username: identifier },
        ],
      },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userModel.findOne({ where: { email } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.userModel.findByPk(id);
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    return await this.userModel.findOne({ where: { phone } });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return await this.userModel.findOne({ where: { username } });
  }

  async update(id: string, data: Partial<UserEntity>): Promise<void> {
    await this.userModel.update(data, { where: { id } });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userModel.findAll();
  }
}
