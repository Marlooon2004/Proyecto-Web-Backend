/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService, LoginResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      // 1. Validar credenciales y obtener token
      const result: LoginResponse = await this.authService.login(loginDto);
      const { user, access_token } = result;

      res.cookie('authToken', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Login exitoso',
        user: {
          id_generated: user.id_generated,
          usuario: user.usuario,
          rol: user.rol,
        },
      });
    } catch (error) {
      console.error('Error en login:', error.message);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message || 'Credenciales incorrectas',
      });
    }
  }

  @Public()
  @Post('logout')
  logout(@Res() res: Response) {
    // eliminar cookie
    res.clearCookie('authToken', {
      path: '/',
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Logout exitoso',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return {
      success: true,
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verify(@Req() req: Request) {
    return {
      success: true,
      valid: true,
      user: req.user,
    };
  }
}
