import { Messages } from './../../messages/messages';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({
    message: Messages.USER_EMAIL_MUST_NOT_BE_EMPTY,
  })
  @IsEmail({}, { message: Messages.USER_EMAIL_MUST_BE_VALID })
  @MaxLength(200, {
    message: `${Messages.USER_EMAIL_MAX_LENGTH_EXCEEDED}: 200`,
  })
  email: string;

  @IsNotEmpty({
    message: Messages.USER_NAME_MUST_NOT_BE_EMPTY,
  })
  @MaxLength(200, { message: `${Messages.USER_NAME_MAX_LENGTH_EXCEEDED}: 200` })
  name: string;

  @IsNotEmpty({
    message: Messages.USER_PASSWORD_MUST_NOT_BE_NULL,
  })
  @MinLength(6, {
    message: `${Messages.USER_PASSWORD_MIN_LENGTH_RESTRICTION}: 6`,
  })
  password: string;

  @IsNotEmpty({
    message: Messages.USER_PASSWORD_CONFIRMATION_MUST_NOT_BE_NULL,
  })
  @MinLength(6, {
    message: `${Messages.USER_PASSWORD_CONFIRMATION_MIN_LENGTH_RESTRICTION}: 6`,
  })
  passwordConfirmation: string;
}
