import { Injectable, NotFoundException } from '@nestjs/common';
//bd
import { Contrato } from './entities/contrato.entity';
import { Tarifa } from './entities/tarifa.entity';
import { Moto } from './entities/moto.entity';
import { Marca } from './entities/marca.entity';
import { Modelo } from './entities/modelo.entity';
import { Cliente } from 'src/users/entities/cliente.entity';
import { Usuario } from 'src/users/entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContratoService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,

    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,

    @InjectRepository(Contrato)
    private contratoRepository: Repository<Contrato>,

    @InjectRepository(Tarifa)
    private tarifaRepository: Repository<Tarifa>,

    @InjectRepository(Marca)
    private marcaRepository: Repository<Marca>,

    @InjectRepository(Modelo)
    private modeloRepository: Repository<Modelo>,

    @InjectRepository(Moto)
    private motoRepository: Repository<Moto>,
  ) {}

  async findContractByUsuarioId(usuarioId: string) {
    const cliente = await this.clienteRepository.findOne({
      where: { usuario: { id_generated: usuarioId } },
      relations: ['usuario'],
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    const contratos = await this.contratoRepository.find({
      where: { cliente: { id_generated: cliente.id_generated } },
      relations: [
        'cliente',
        'cliente.usuario',
        'tarifa',
        'moto',
        'moto.modelo',
        'moto.modelo.marca',
      ],
      order: {
        fecha_inicio: 'DESC',
      },
    });
    if (!contratos || contratos.length === 0) {
      throw new NotFoundException(
        'No se encontraron contratos para este cliente',
      );
    }
    return contratos;
  }

  //obtener scooters
  async getScooters() {
    const scooters = await this.motoRepository.find({
      where: { categoria: 'Scooters' },
    });
    if (!scooters || scooters.length === 0) {
      throw new NotFoundException(
        'No se encontraron motos de la categoria Scooters',
      );
    }
    return scooters;
  }

  //obtener sports motorcicles
  async getSports() {
    const sports = await this.motoRepository.find({
      where: { categoria: 'Sport' },
    });
    if (!sports || sports.length === 0) {
      throw new NotFoundException(
        'No se encontraron motos de la categoria Sport',
      );
    }
    return sports;
  }

  //obtener street motorcicles
  async getStreets() {
    const street = await this.motoRepository.find({
      where: { categoria: 'Street' },
    });
    if (!street || street.length === 0) {
      throw new NotFoundException(
        'No se encontraron motos de la categoria Street',
      );
    }
    return street;
  }

  //obtener touring motorcicles
  async getTouring() {
    const touring = await this.motoRepository.find({
      where: { categoria: 'Touring' },
    });
    if (!touring || touring.length === 0) {
      throw new NotFoundException(
        'No se encontraron motos de la categoria Touring',
      );
    }
    return touring;
  }

  //obtener motocross motorcicles
  async getMotocross() {
    const motocross = await this.motoRepository.find({
      where: { categoria: 'Motocross' },
    });
    if (!motocross || motocross.length === 0) {
      throw new NotFoundException(
        'No se encontraron motos de la categoria Motocross',
      );
    }
    return motocross;
  }

  //obtener custom motorcicles
  async getCustom() {
    const custom = await this.motoRepository.find({
      where: { categoria: 'Custom' },
    });
    if (!custom || custom.length === 0) {
      throw new NotFoundException(
        'No se encontraron motos de la categoria Custom',
      );
    }
    return custom;
  }
}
