import { BaseQueryParametersDTO } from 'src/modules/_shared/base-query-parameters-dto';

export class FindUsersQueryDTO extends BaseQueryParametersDTO {
  name: string;
  email: string;
  status: boolean;
  role: string;
}
