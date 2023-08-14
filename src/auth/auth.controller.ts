import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOkResponse({ description: 'Return a token', type: String })
  /**
   * TODO types
   * create a class that implements ValidationError type for the swagger,
   * currently the swagger does not recognize the type.
   * Same for all validation pipes - need to think about a generic solution.
   */
  @ApiBadRequestResponse({ type: ValidationError })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
