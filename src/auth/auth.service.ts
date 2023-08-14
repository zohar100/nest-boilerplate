import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async signPayload(payload: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = payload;
    return this.jwtService.signAsync(rest);
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);

    const token = await this.signPayload(user);
    return token;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findOne({ email });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }

    const token = await this.signPayload(user);
    return token;
  }
}
