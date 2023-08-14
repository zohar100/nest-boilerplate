import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { FindUserDto } from './dto/find-user.dto';
import { UsersException, UsersExceptionTypes } from './users.exception';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { email, password } = createUserDto;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new UsersException(UsersExceptionTypes.alreadyExist);
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    await newUser.save();

    return newUser;
  }

  findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async findOne(findUserDto: FindUserDto): Promise<UserDocument> {
    const user = await this.userModel.findOne(findUserDto);
    if (!user) {
      throw new UsersException(UsersExceptionTypes.notFound);
    }
    return user;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: id },
        updateUserDto,
        { new: true },
      );

      return updatedUser;
    } catch {
      throw new UsersException(UsersExceptionTypes.notFound);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
