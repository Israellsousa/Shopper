import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MeasureService {
  // Método para criar uma nova medição
  static async createMeasure(data: {
    image_url: string;
    measure_value: number;
    measure_uuid: string;
    customer_code: string;
    measure_datetime: Date;
    measure_type: 'WATER' | 'GAS';
  }) {
    return prisma.measure.create({
      data: {
        ...data,
        measure_datetime: new Date(data.measure_datetime),
      },
    });
  }

  // Método para confirmar uma medição existente
  static async confirmMeasure(measure_uuid: string, confirmed_value: number) {
    return prisma.measure.update({
      where: { measure_uuid }, // Usando 'measure_uuid' como a chave primária
      data: { 
        confirmed_value, 
        has_confirmed: true 
      },
    });
  }

  // Método para listar medições de um cliente, com a opção de filtrar por tipo de medição
  static async listMeasures(customer_code: string, measure_type?: 'WATER' | 'GAS') {
    return prisma.measure.findMany({
      where: {
        customer_code,
        ...(measure_type && { measure_type }),
      },
    });
  }

  // Método para verificar se já existe uma medição em uma data específica
  static async checkExistingMeasure(customer_code: string, measure_type: 'WATER' | 'GAS', measure_datetime: Date) {
    return prisma.measure.findFirst({
      where: {
        customer_code,
        measure_type,
        measure_datetime,
      },
    });
  }

  // Método para encontrar uma medição pelo UUID
  static async findMeasureByUuid(measure_uuid: string) {
    return prisma.measure.findUnique({
      where: { measure_uuid }, // Usando 'measure_uuid' para encontrar a medição
    });
  }

  // Método para atualizar uma medição existente
  static async updateMeasure(measure_uuid: string, confirmed_value: number) {
    return prisma.measure.update({
      where: { measure_uuid }, // Usando 'measure_uuid' como a chave primária
      data: { confirmed_value, has_confirmed: true },
    });
  }
}
