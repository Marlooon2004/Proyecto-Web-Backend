import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { ContratoService } from './contrato.service';
import { CreateContractDTO } from './dto/create-contract.dto';

@Controller('contratos')
export class ContratoController {
  constructor(private readonly contratosService: ContratoService) {}

  @Public()
  @Post()
  createNewContract(@Body() createContractDTO: CreateContractDTO) {
    return this.contratosService.crearNuevoContrato(createContractDTO);
  }

  @Public()
  @Get('scooters')
  getAllScooters() {
    return this.contratosService.getScooters();
  }

  @Public()
  @Get('tourings')
  getAllTourings() {
    return this.contratosService.getTouring();
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
  @Get('motocross')
  getAllMotocross() {
    return this.contratosService.getMotocross();
  }

  @Public()
  @Get(':usuarioId')
  getUserByUsername(@Param('usuarioId') usuarioId: string) {
    return this.contratosService.findContractByUsuarioId(usuarioId);
  }
}
