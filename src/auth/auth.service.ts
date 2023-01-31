import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private userModel: Model<UserModel>) {}

  async createUser(dto: AuthDto) {
    const { login, password } = dto;
    const checkIfUserExist = await this.findUser(login);
    if (checkIfUserExist) {
      throw new HttpException(
        'error: the email address already exists',
        HttpStatus.CONFLICT,
      );
    }
    const salt = bcrypt.genSaltSync(10);
    const newUser = await this.userModel.create({
      email: login,
      passwordHash: bcrypt.hashSync(password, salt),
    });
    return newUser;
  }

  async findUser(email: string) {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async getListOfUsers() {
    return await this.userModel.find();
  }
}
