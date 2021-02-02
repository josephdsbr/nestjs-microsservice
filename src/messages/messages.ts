export class Messages {
  // Validation
  static readonly USER_EMAIL_MUST_NOT_BE_EMPTY =
    'User email must not be empty.';
  static readonly USER_EMAIL_MUST_BE_VALID = 'User email must be valid.';
  static readonly USER_EMAIL_MAX_LENGTH_EXCEEDED =
    'User email max length exceeded';
  static readonly USER_NAME_MAX_LENGTH_EXCEEDED =
    'User name max length exceeded';
  static readonly USER_NAME_MUST_NOT_BE_EMPTY = 'User name must not be empty.';
  static readonly USER_PASSWORD_MUST_NOT_BE_NULL =
    'User password must no be null.';
  static readonly USER_PASSWORD_MIN_LENGTH_RESTRICTION =
    'User password min length restriction';
  static readonly USER_PASSWORD_CONFIRMATION_MUST_NOT_BE_NULL =
    'User password confirmation must no be null.';
  static readonly USER_PASSWORD_CONFIRMATION_MIN_LENGTH_RESTRICTION =
    'User password confirmation min length restriction';
  static readonly USER_EMAIL_DOES_NOT_EXIST = 'User email does not exist.';
  static USER_PASSWORD_DOES_NOT_MATCH = 'User password does not match.';
  static USER_NOT_FOUND = 'User not found.';
  static USER_NAME_MUST_BE_STRING = 'User name must be a string.';
  static DATABASE_PERSISTENCE_ERROR = 'Database persistence error.';
  static FORBIDDEN_ACCESS = 'Forbidden access';
}
