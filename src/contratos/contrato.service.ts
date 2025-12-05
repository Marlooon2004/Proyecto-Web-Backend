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

  //obtener scooters
  async getScooters() {
    const scooters = await this.motoRepository.find({
      where: { categoria: 'Scooters' },
      relations: ['modelo', 'modelo.marca'],
    });
    if (!scooters || scooters.length === 0) {
      throw new NotFoundException(
        'No se encontraron motos de la categoria Scooters',
      );
    }
    return scooters.map((moto) => ({
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

  //obtener touring motorcicles
  async getTouring() {
    const touring = await this.motoRepository.find({
      where: { categoria: 'Touring' },
      relations: ['modelo', 'modelo.marca'],
    });
    if (!touring || touring.length === 0) {
      throw new NotFoundException(
        'No se encontraron motos de la categoria Touring',
      );
    }
    return touring.map((moto) => ({
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

  //obtener sports motorcicles
  async getSports() {
    const sports = await this.motoRepository.find({
      where: { categoria: 'Sport' },
      relations: ['modelo', 'modelo.marca'],
    });
    if (!sports || sports.length === 0) {
      throw new NotFoundException(
        'No se encontraron motos de la categoria Sport',
      );
    }
    return sports.map((moto) => ({
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

  //obtener street motorcicles
  async getStreets() {
    const street = await this.motoRepository.find({
      where: { categoria: 'Street' },
      relations: ['modelo', 'modelo.marca'],
    });
    if (!street || street.length === 0) {
      throw new NotFoundException(
        'No se encontraron motos de la categoria Street',
      );
    }
    return street.map((moto) => ({
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

  //obtener motocross motorcicles
  async getMotocross() {
    const motocross = await this.motoRepository.find({
      where: { categoria: 'Motocross' },
      relations: ['modelo', 'modelo.marca'],
    });
    if (!motocross || motocross.length === 0) {
      throw new NotFoundException(
        'No se encontraron motos de la categoria Motocross',
      );
    }
    return motocross.map((moto) => ({
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

  //obtener custom motorcicles
  async getCustom() {
    const custom = await this.motoRepository.find({
      where: { categoria: 'Custom' },
      relations: ['modelo', 'modelo.marca'],
    });
    if (!custom || custom.length === 0) {
      throw new NotFoundException(
        'No se encontraron motos de la categoria Custom',
      );
    }
    return custom.map((moto) => ({
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

  async crearNuevoContrato(createContractDTO: CreateContractDTO) {
    // Obtener cliente
    const cliente = await this.clienteRepository.findOne({
      where: { id_generated: createContractDTO.idCliente },
      relations: ['usuario', 'municipio'],
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Comprobar si hay motos libres con la marca y modelo solicitada
    const moto = await this.motoRepository.findOne({
      where: {
        id_generated: createContractDTO.idMoto,
      },
      relations: ['modelo', 'modelo.marca'],
    });

    if (!moto) {
      throw new NotFoundException(
        'La moto no esta libre en estos momentos para reserva',
      );
    }

    // Crear tarifa
    const tarifaTotal = this.tarifaRepository.create({
      tarifa_contrato: createContractDTO.costoTotal,
      tarifa_prorroga: 0,
    });

    // Si existe la moto disponible
    if (moto && cliente) {
      // Actualizar estado moto a 'A' (alquilada)
      await this.motoRepository.update(
        { id_generated: moto.id_generated },
        { situacion: 'A' },
      );
    }

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
      return {
        contrato: contratoGuardado,
        tarifa: tarifaGuardada,
        mensaje: 'Contrato creado exitosamente',
      };
    }
  }

  /*
  async findMotoContrato(createContractDTO: CreateContractDTO) {
    const contratosTerminados = await this.contratoRepository.find({
      where: {
        fecha_fin: LessThanOrEqual(createContractDTO.fechaInicio),
        dias_prorroga: 0,
      },
      relations: ['moto', 'moto.modelo', 'moto.modelo.marca'],
    });
    const contratosCoincidentes = contratosTerminados.filter((contrato) => {
      const mismoModelo =
        contrato.moto.modelo.modelo === createContractDTO.modelo;
      const mismaMarca =
        contrato.moto.modelo.marca.marca === createContractDTO.marca;
      return mismoModelo && mismaMarca;
    });
    if (contratosCoincidentes.length === 0) {
      throw new NotFoundException(
        'No se encontraron contratos con motos con modelos similares',
      );
    }
    const contratoSeleccionado = contratosCoincidentes.sort(
      (a, b) =>
        new Date(b.fecha_fin).getTime() - new Date(a.fecha_fin).getTime(),
    )[0];
    return contratoSeleccionado.moto;
  }*/
}
