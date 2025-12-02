/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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

interface MotoResponse {
  id_generated: string;
  matricula: string;
  color: string;
  cantd_km: number;
  modelo: string;
  marca: string;
  situacion: string;
  ruta_imagen: string;
  descripcion: string;
  categoria: string;
  costo_dia: number;
  image: string;
  price: number;
}

@Injectable()
export class ContratoService {
  private allMotosCache: MotoResponse[] | null = null;

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

  private async getAllMotos(): Promise<any[]> {
    if (this.allMotosCache) {
      return this.allMotosCache;
    }

    const motos = await this.motoRepository.find({
      relations: ['modelo', 'modelo.marca'],
      order: { categoria: 'ASC' },
    });

    this.allMotosCache = motos.map((moto) => ({
      id_generated: moto.id_generated,
      matricula: moto.matricula,
      color: moto.color,
      cantd_km: moto.cantd_km,
      modelo: moto.modelo?.modelo || 'Sin modelo',
      marca: moto.modelo?.marca?.marca || 'Sin marca',
      situacion: moto.situacion,
      ruta_imagen: moto.ruta_imagen,
      descripcion: moto.descripcion,
      categoria: moto.categoria,
      costo_dia: moto.costo_dia,
      image: moto.ruta_imagen,
      price: moto.costo_dia,
    }));

    return this.allMotosCache;
  }

  async getMotosByCategory(categoria: string) {
    const allMotos = await this.getAllMotos();
    const motos = allMotos.filter((moto) => moto.categoria === categoria);

    if (!motos || motos.length === 0) {
      throw new NotFoundException(
        `No se encontraron motos de la categoría ${categoria}`,
      );
    }
    return motos;
  }

  async getScooters() {
    return this.getMotosByCategory('Scooters');
  }

  async getTouring() {
    return this.getMotosByCategory('Touring');
  }

  async getSports() {
    return this.getMotosByCategory('Sport');
  }

  async getStreets() {
    return this.getMotosByCategory('Street');
  }

  async getMotocross() {
    return this.getMotosByCategory('Motocross');
  }

  async getCustom() {
    return this.getMotosByCategory('Custom');
  }
}
