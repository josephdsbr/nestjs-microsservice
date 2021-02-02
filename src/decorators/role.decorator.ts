import { SetMetadata } from '@nestjs/common';

const Role = (role: string) => SetMetadata('role', role);

export default Role;
