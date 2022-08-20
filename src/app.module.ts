import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TodoModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
