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
}
