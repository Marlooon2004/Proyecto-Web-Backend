//dto
import { CreateUserDTO } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
//paquetes
import { UsersService } from './user.service';
//otros imports
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from '../auth/decorators/public.decorator';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    username: string;
    rol: string;
  };
}

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

  //actualizar contrasenya usuario
  @Patch('password')
  changePassword(
    @Req() request: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const usuarioId = request.user.userId;
    return this.usersService.changePassword(usuarioId, changePasswordDto);
  }

  //modificar perfil
  @Put('profile')
  updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const usuarioId = request.user.userId;
    return this.usersService.update(usuarioId, updateUserDto);
  }
}
