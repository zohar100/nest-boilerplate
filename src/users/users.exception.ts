import { HttpException, HttpStatus } from '@nestjs/common';

export enum UsersExceptionTypes {
  alreadyExist = 'alreadyExist',
  notFound = 'notFound',
}

const usersExceptionTypesToMessageAndStatus: Record<
  UsersExceptionTypes,
  [message: string, status: HttpStatus]
> = {
  [UsersExceptionTypes.alreadyExist]: [
    'user already exists',
    HttpStatus.BAD_REQUEST,
  ],
  [UsersExceptionTypes.notFound]: ['cannot find user', HttpStatus.NOT_FOUND],
};

export class UsersException extends HttpException {
  constructor(type: UsersExceptionTypes) {
    const [message, status] = usersExceptionTypesToMessageAndStatus[type];
    super(message, status);
  }
}
