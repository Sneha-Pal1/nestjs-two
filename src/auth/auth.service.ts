import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // Adjust the import path as necessary
import { User, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        'Email already in use! Please try with a different email',
      );
    }
    const hashedPassword = await this.hashPassword(registerDto.password);

    const newlyCreatedUser = this.userRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.USER,
    });

    const saveUser = await this.userRepository.save(newlyCreatedUser);

    const { password, ...result } = saveUser;
    return {
      user: result,
      message: 'Registration successful! Please login to continue.',
    };
  }

  async createAdmin(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        'Email already in use! Please try with a different email',
      );
    }
    const hashedPassword = await this.hashPassword(registerDto.password);
    const newlyCreatedUser = this.userRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    const saveUser = await this.userRepository.save(newlyCreatedUser);

    const { password, ...result } = saveUser;
    return {
      user: result,
      message: 'Admin user created successfully! Please login to continue.',
    };
  }

  async login(loginDto: loginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (
      !user ||
      !(await this.verifyPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException(
        'Invalid credentials or account not exists',
      );
    }

    //generate tokens
    const token = this.generateTokens(user);
    const { password, ...result } = user;
  }
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: 'refresh_secret',
      });
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      const acessToken = this.generateAccessToken(user);
      return { acessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  async getUserById(UserId: string) {
    const user = await this.userRepository.findOne({
      where: { id: UserId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private generateTokens(user: User) {
    return {
      acessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }
  private generateAccessToken(user: User): string {
    // -> email, sub(id), role -> RBAC -> user? admin?
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      secret: 'jwt_secret',
      expiresIn: '15m',
    });
  }
  private generateRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
    };
    return this.jwtService.sign(payload, {
      secret: 'refresh_secret',
      expiresIn: '7d',
    });
  }
}
