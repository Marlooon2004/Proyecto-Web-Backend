/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
//bd
import { Contrato } from './entities/contrato.entity';
import { Tarifa } from './entities/tarifa.entity';
import { Moto } from './entities/moto.entity';
import { Marca } from './entities/marca.entity';
import { Modelo } from './entities/modelo.entity';
import { Cliente } from 'src/users/entities/cliente.entity';
import { Usuario } from 'src/users/entities/usuario.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContractDTO } from './dto/create-contract.dto';

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

  //obtener motos segun categoria
  async getMotos(categoriaMotos: string) {
    const motos = await this.motoRepository.find({
      where: { categoria: categoriaMotos },
      relations: ['modelo', 'modelo.marca'],
    });
    if (!motos || motos.length == 0) {
      throw new NotFoundException(
        'No se encontraron motos de la categoria: ' + categoriaMotos,
      );
    }
    return motos.map((moto) => ({
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
  }

  //obtener scooters
  async getScooters() {
    return this.getMotos('Scooters');
  }

  //obtener touring
  async getTouring() {
    return this.getMotos('Touring');
  }

  //obtener sports
  async getSports() {
    return this.getMotos('Sport');
  }

  //obtener street
  async getStreets() {
    return this.getMotos('Street');
  }

  //obtener motocross
  async getMotocross() {
    return this.getMotos('Motocross');
  }

  //obtener custom
  async getCustom() {
    return this.getMotos('Custom');
  }

  //crear nuevo contrato
  async crearNuevoContrato(createContractDTO: CreateContractDTO) {
    //buscar cliente
    const cliente = await this.clienteRepository.findOne({
      where: { id_generated: createContractDTO.idCliente },
      relations: ['usuario', 'municipio'],
    });
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Comprobar si la moto solicitada existe
    const moto = await this.motoRepository.findOne({
      where: {
        id_generated: createContractDTO.idMoto,
      },
      relations: ['modelo', 'modelo.marca'],
    });
    if (!moto) {
      throw new NotFoundException('Moto no encontrada');
    }

    // Crear tarifa
    const tarifaTotal = this.tarifaRepository.create({
      tarifa_contrato: createContractDTO.costoTotal,
      tarifa_prorroga: 0,
    });

    //comprobar que la moto no este ya en un contrato
    const existeContrato = await this.contratoRepository.findOne({
      where: { moto: { id_generated: moto.id_generated } },
      relations: [
        'cliente',
        'cliente.municipio',
        'cliente.usuario',
        'moto',
        'moto.modelo',
        'moto.modelo.marca',
      ],
    });
    if (existeContrato) {
      throw new ConflictException('La moto ya se encuentra en un contrato');
    }

    if (moto && cliente && !existeContrato) {
      await this.motoRepository.update(
        { id_generated: moto.id_generated },
        { situacion: 'A' }, //cambiar estado de libre a alquilado
      );
    }

    // Crear contrato
    if (!existeContrato) {
      const nuevoContrato = new Contrato();
      nuevoContrato.cliente = cliente;
      nuevoContrato.fecha_inicio = createContractDTO.fechaInicio;
      nuevoContrato.fecha_fin = createContractDTO.fechaFin;
      nuevoContrato.dias_prorroga = 0;
      nuevoContrato.forma_pago = createContractDTO.formaPago;
      nuevoContrato.seguro = createContractDTO.seguro;
      nuevoContrato.tarifa = tarifaTotal;
      nuevoContrato.moto = moto;
      nuevoContrato.contrato_activo = true;
      nuevoContrato.fecha_cancelacion = null;

      const tarifaGuardada = await this.tarifaRepository.save(tarifaTotal);
      const contratoGuardado =
        await this.contratoRepository.save(nuevoContrato);
    }
  }
}
