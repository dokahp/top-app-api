import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model/user.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<UserModel>,
    private jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto) {
    const { login, password } = dto;
    const checkIfUserExist = await this.findUser(login);
    if (checkIfUserExist) {
      throw new HttpException(
        'error: the email address already exists',
        HttpStatus.CONFLICT,
      );
    }
    const salt = await bcrypt.genSalt(10);
    const newUser = await this.userModel.create({
      email: login,
      passwordHash: await bcrypt.hash(password, salt),
    });
    return newUser;
  }

  async findUser(email: string) {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);
    if (!user) {
      throw new HttpException(
        'error: email or password not valid',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new HttpException(
        'error: email or password not valid',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { email: user.email };
  }

  async login(email: string) {
    const payload = { email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getListOfUsers() {
    return await this.userModel.find();
  }
}
