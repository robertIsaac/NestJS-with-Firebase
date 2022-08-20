import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
import { auth } from 'firebase-admin';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate(token) {
    return auth()
      .verifyIdToken(token, true)
      .catch((err) => {
        console.warn(err);
        throw new UnauthorizedException();
      });
  }
}
