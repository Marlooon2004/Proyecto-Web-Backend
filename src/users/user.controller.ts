import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './user.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Request } from 'express';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //obtener municipios para componente registro y cuenta de perfil
  @Public()
  @Get('municipios')
  async obtenerMunicipios() {
    return await this.usersService.obtenerTodosLosMunicipios();
  }
  //crear nuevo usuario
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.createNewUser(createUserDto);
  }
  //obtener usuario para cargar datos para cuenta perfil
  @Public()
  @Get('usuario/:usuarioId')
  getUserByUsername(@Param('usuarioId') usuarioId: string) {
    return this.usersService.findByUsuarioId(usuarioId);
  }
}
