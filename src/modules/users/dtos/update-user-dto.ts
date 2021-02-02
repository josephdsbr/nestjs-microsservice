import { UserRole } from './../domain/user-role';
import { Messages } from 'src/messages/messages';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString({
    message: Messages.USER_NAME_MUST_BE_STRING,
  })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: Messages.USER_EMAIL_MUST_BE_VALID })
  email: string;

  @IsOptional()
  role: UserRole;

  @IsOptional()
  status: boolean;
}
