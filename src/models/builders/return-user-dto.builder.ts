import { User } from 'src/users/user.entity';
import { ReturnUserDTO } from './../dtos/return-user-dto';
export class ReturnUserDTOBuilder {
  static fromEntity(entity: User): ReturnUserDTO {
    return new ReturnUserDTO(entity);
  }
}
