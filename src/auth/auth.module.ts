import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { UserSchema } from './user.model/user.model';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [AuthService],
})
export class AuthModule {}
