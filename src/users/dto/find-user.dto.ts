import { PartialType } from '@nestjs/mapped-types';
import { User } from '../schemas/user.schema';

export class FindUserDto extends PartialType(User) {
  id?: string;
}
