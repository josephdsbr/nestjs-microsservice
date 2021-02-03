import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

export const mailerConfig: MailerOptions = {
  template: {
    dir: path.resolve(__dirname, '..', '..', 'src', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
  defaults: {
    from: '"nest-modules" <modules@nestjs.com>',
  },
  transport: {
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'c085a0540cb5b0',
      pass: '2f9b50c7283894',
    },
  },
};
