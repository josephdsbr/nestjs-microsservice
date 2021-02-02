import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Messages } from 'src/messages/messages';

export class CredentialsDTO {
  @IsNotEmpty({
    message: Messages.USER_EMAIL_MUST_NOT_BE_EMPTY,
  })
  @IsEmail({}, { message: Messages.USER_EMAIL_MUST_BE_VALID })
  email: string;
  @IsNotEmpty({
    message: Messages.USER_PASSWORD_MUST_NOT_BE_NULL,
  })
  @MinLength(6, {
    message: `${Messages.USER_PASSWORD_MIN_LENGTH_RESTRICTION}: 6`,
  })
  password: string;
}
