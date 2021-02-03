import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { Messages } from 'src/messages/messages';

export class ChangePasswordDTO {
  @IsString({
    message: Messages.USER_PASSWORD_MUST_BE_VALID,
  })
  @MinLength(6, {
    message: `${Messages.USER_PASSWORD_MIN_LENGTH_RESTRICTION}: 6`,
  })
  password: string;

  @IsString({
    message: Messages.USER_PASSWORD_CONFIRMATION_MUST_BE_VALID,
  })
  @MinLength(6, {
    message: `${Messages.USER_PASSWORD_CONFIRMATION_MIN_LENGTH_RESTRICTION}: 6`,
  })
  passwordConfirmation: string;
}
