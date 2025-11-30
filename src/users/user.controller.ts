import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './user.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Request } from 'express';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Get('municipios')
  async obtenerMunicipios() {
    return await this.usersService.obtenerTodosLosMunicipios();
  }
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.createNewUser(createUserDto);
  }
}
