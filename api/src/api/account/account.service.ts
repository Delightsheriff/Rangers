import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/infrastructure/orm/repositories/user.repository';

@Injectable()
export class AccountService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAccountDetails(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateAccountDetails(
    userId: number,
    updateData: {
      firstName?: string;
      lastName?: string;
      middleName?: string;
      phone?: string;
      username?: string;
    },
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Check if the new username or phone already exists
    const existingUser = await this.userRepository.findByUsername(
      updateData.username,
    );
    if (existingUser && existingUser.id !== userId) {
      throw new NotFoundException('Username already exists');
    }
    const existingPhone = await this.userRepository.findByPhone(
      updateData.phone,
    );
    if (existingPhone && existingPhone.id !== userId) {
      throw new NotFoundException('Phone already exists');
    }

    await this.userRepository.update(userId, updateData);
  }
}
