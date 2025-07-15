import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { env } from '../config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    await this.usersService.create(registerUserDto);
    return this.login({
      email: registerUserDto.email,
      password: registerUserDto.password,
    });
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: env.jwtRefreshSecret,
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(refreshToken, {
        secret: env.jwtRefreshSecret,
      });

      const user = await this.usersService.findOne(payload.sub);
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
