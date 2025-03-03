// src/infrastructure/repositories/TypeORMUserRepository.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/postgres.connect';
import { User } from '../entities/user.entity';
import { CustomError } from '../../common/types/custom-error';

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const newUser = this.repository.create(user);
      return await this.repository.save(newUser);
    } catch (error) {
      console.log('🚀 - IuserRepository - error:', error);

      throw new CustomError({ message: 'ERROR', code: 500 }, 'IuserRepository.create', 'Business');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.repository.findOneBy({ email });
    } catch (error) {
      console.log('🚀 - IuserRepository - findByEmail - error:', error);
      throw new CustomError({ message: 'ERROR', code: 500 }, 'IuserRepository.findByEmail', 'Business');
    }
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
