import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { UserRole } from './enums/user-role.enum';
import { PaginationDto } from '../common/dtos/pagination.dto';

export type UserSafe = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<UserSafe> {
    const {
      email,
      password,
      name = undefined,
      role = UserRole.USER,
    } = registerUserDto;

    const existingUser = await this.usersRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hash = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({
      email,
      password: hash,
      name,
      role,
    });

    const savedUser = await this.usersRepo.save(user);

    return UsersService.asUserSafe(savedUser);
  }

  async findOne(id: string): Promise<UserSafe> {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return UsersService.asUserSafe(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserSafe> {
    const existingUser = await this.usersRepo.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const user = await this.usersRepo.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updatedUser = await this.usersRepo.save(user);
    return UsersService.asUserSafe(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.usersRepo.remove(user);
  }

  async findAll(paginationDto: PaginationDto): Promise<{
    users: UserSafe[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [users, total] = await this.usersRepo.findAndCount({
      skip,
      take: limit,
    });

    return {
      users: users.map((user) => UsersService.asUserSafe(user)),
      total,
      page,
      limit,
    };
  }

  private static asUserSafe(user: User): UserSafe {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
