import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';

@Global()
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'firebase-jwt' })],
  providers: [FirebaseAuthStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
