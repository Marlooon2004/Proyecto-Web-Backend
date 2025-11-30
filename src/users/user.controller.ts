//import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './user.service';
import { Body, Controller, Get } from '@nestjs/common';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('municipios')
  async obtenerMunicipios() {
    return await this.usersService.obtenerTodosLosMunicipios();
  }
}
