import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthSchema } from './auth.model/auth.model';

@Module({
  controllers: [AuthController],
  imports: [MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }])],
})
export class AuthModule {}
