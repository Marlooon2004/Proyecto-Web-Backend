/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface JwtPayload {
  username: string;
  sub: string;
  rol: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const tokenFromCookie = request?.cookies?.authToken;
          if (tokenFromCookie) {
            return tokenFromCookie;
          }

          const authHeader = request?.headers?.authorization;
          if (authHeader && authHeader.startsWith('Bearer')) {
            return authHeader.substring(7);
          }

          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret || 'clave-temporal-para-desarrollo-2024',
    });
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
      rol: payload.rol,
    };
  }
}
