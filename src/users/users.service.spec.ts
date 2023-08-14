import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import {
  createUserDtoStub,
  findUserDtoStub,
  updateUserDtoStub,
} from './dto/stubs';
import { UsersException, UsersExceptionTypes } from './users.exception';

describe('UsersService', () => {
  const mockUserDto = createUserDtoStub();

  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;
  let service: UsersService;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('create user', () => {
    it('should return the saved user', async () => {
      const user = await service.create(mockUserDto);
      expect(user.email).toBe(mockUserDto.email);
    });

    it('should throw user already exists exception', async () => {
      await new userModel(mockUserDto).save();
      await expect(service.create(mockUserDto)).rejects.toThrow(
        new UsersException(UsersExceptionTypes.alreadyExist),
      );
    });
  });

  describe('find user', () => {
    beforeAll(async () => {
      await service.create(mockUserDto);
    });

    it('should return the user', async () => {
      const user = await service.findOne(findUserDtoStub());
      expect(user).toBeDefined();
    });

    it('should throw not found exception', async () => {
      await expect(
        service.findOne({ email: 'notfound@email.com' }),
      ).rejects.toThrow(new UsersException(UsersExceptionTypes.notFound));
    });
  });

  describe('find all users', () => {
    beforeAll(async () => {
      await service.create(mockUserDto);
    });

    it('should return list of users', async () => {
      const users = await service.findAll();
      expect(users).toHaveLength(1);
    });
  });

  describe('update user', () => {
    let savedUser: UserDocument;
    beforeAll(async () => {
      savedUser = await service.create(mockUserDto);
    });

    it('should update user`s userName', async () => {
      const updatedUser = await service.update(
        savedUser.id,
        updateUserDtoStub(),
      );

      expect(updatedUser.userName).toBe(updateUserDtoStub().userName);
    });

    it('should throw user not exist exception', async () => {
      await expect(service.update('1', updateUserDtoStub())).rejects.toThrow(
        new UsersException(UsersExceptionTypes.notFound),
      );
    });
  });
});
