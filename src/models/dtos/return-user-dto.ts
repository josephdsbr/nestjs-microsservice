import { create } from 'domain';
import { User } from 'src/modules/users/user.entity';

export class ReturnUserDTO {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: string;
  readonly status: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(entity: User) {
    const { id, email, name, role, status, createdAt, updatedAt } = entity;
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
