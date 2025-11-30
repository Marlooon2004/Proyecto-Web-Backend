import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

interface JwtPayload {
  username: string;
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'tu-clave-secreta-super-segura',
    });
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
      email: payload.email,
    };
  }
}
