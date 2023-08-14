import { User } from '../schemas/user.schema';
import { CreateUserDto } from './create-user.dto';
import { FindUserDto } from './find-user.dto';
import { UpdateUserDto } from './update-user.dto';

const mockUser: User = {
  userName: 'test',
  password: '123456',
  email: 'test@email.com',
};

export const findUserDtoStub = (): FindUserDto => ({
  email: mockUser.email,
});

export const createUserDtoStub = (): CreateUserDto => mockUser;

export const updateUserDtoStub = (): UpdateUserDto => ({
  userName: 'test1',
});
