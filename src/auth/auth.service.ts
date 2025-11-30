/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

export interface UserWithoutPassword {
  id_generated: string;
  usuario: string;
  rol: string;
}

export interface LoginResponse {
  access_token: string;
  user: UserWithoutPassword;
}

export interface JwtPayload {
  username: string;
  sub: string;
  rol: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByUsername(username);

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.contrasenya);

      if (isPasswordValid) {
        const { contrasenya: _, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error validando usuario:', error);
      return null;
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload: JwtPayload = {
      username: user.usuario,
      sub: user.id_generated,
      rol: user.rol,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id_generated: user.id_generated,
        usuario: user.usuario,
        rol: user.rol,
      },
    };
  }
}
