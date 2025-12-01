import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { ContratoService } from './contrato.service';

@Controller('contratos')
export class ContratoController {
  constructor(private readonly contratosService: ContratoService) {}

  @Public()
  @Get(':usuarioId')
  getUserByUsername(@Param('usuarioId') usuarioId: string) {
    return this.contratosService.findContractByUsuarioId(usuarioId);
  }

  @Public()
  @Get('scooters')
  getAllScooters() {
    return this.contratosService.getScooters();
  }

  @Public()
  @Get('sports')
  getAllSports() {
    return this.contratosService.getSports();
  }

  @Public()
  @Get('streets')
  getAllStreets() {
    return this.contratosService.getStreets();
  }

  @Public()
  @Get('customs')
  getAllCustoms() {
    return this.contratosService.getCustom();
  }

  @Public()
  @Get('tourings')
  getAllTourings() {
    return this.contratosService.getTouring();
  }

  @Public()
  @Get('motocross')
  getAllMotocross() {
    return this.contratosService.getMotocross();
  }
}
