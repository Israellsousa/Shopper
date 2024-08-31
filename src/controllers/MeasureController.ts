import { Request, Response } from 'express';
import { MeasureService } from '../services/MeasureService';
import { GeminiClient } from '../utils/GeminiClient';

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

const handleError = (error: unknown, res: Response) => {
  const err = error as CustomError;
  res.status(err.statusCode || 500).json({ error_code: err.code, error_description: err.message });
};

// Método para fazer o upload de uma medição
export const uploadMeasure = async (req: Request, res: Response) => {
  try {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    // Validação de imagem base64
    if (typeof image !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(image)) {
      return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'Imagem base64 inválida' });
    }

    // Validação do tipo de medição
    if (!['WATER', 'GAS'].includes(measure_type)) {
      return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'Tipo de medição inválido' });
    }

    // Verificar se já existe uma medição para o mesmo período
    const existingMeasure = await MeasureService.checkExistingMeasure(customer_code, measure_type, new Date(measure_datetime));
    if (existingMeasure) {
      return res.status(409).json({ error_code: 'DOUBLE_REPORT', error_description: 'Leitura do mês já realizada' });
    }

    // Processar imagem com a API do Google Gemini
    const geminiResponse = await GeminiClient.processImage(image);
    if (!geminiResponse) {
      return res.status(500).json({ error_code: 'INTERNAL_ERROR', error_description: 'Erro ao processar a imagem' });
    }

    // Salvar a nova medição no banco de dados
    const result = await MeasureService.createMeasure({
      image_url: geminiResponse.image_url,
      measure_value: geminiResponse.measure_value,
      measure_uuid: geminiResponse.measure_uuid,
      customer_code,
      measure_datetime: new Date(measure_datetime),
      measure_type
    });

    res.status(200).json({
      image_url: geminiResponse.image_url,
      measure_value: geminiResponse.measure_value,
      measure_uuid: geminiResponse.measure_uuid
    });

  } catch (error) {
    handleError(error, res);
  }
};

// Método para confirmar uma medição
export const confirmMeasure = async (req: Request, res: Response) => {
  try {
    const { measure_uuid, confirmed_value } = req.body;

    // Validação dos parâmetros de entrada
    if (typeof measure_uuid !== 'string' || typeof confirmed_value !== 'number') {
      return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'Dados fornecidos são inválidos' });
    }

    // Verificar se a medição existe
    const measure = await MeasureService.findMeasureByUuid(measure_uuid);
    if (!measure) {
      return res.status(404).json({ error_code: 'MEASURE_NOT_FOUND', error_description: 'Leitura não encontrada' });
    }
    
    // Verificar se a medição já foi confirmada
    if (measure.has_confirmed) {
      return res.status(409).json({ error_code: 'CONFIRMATION_DUPLICATE', error_description: 'Leitura já confirmada' });
    }

    // Confirmar a medição
    await MeasureService.confirmMeasure(measure_uuid, confirmed_value);
    res.status(200).json({ success: true });

  } catch (error) {
    handleError(error, res);
  }
};

// Método para listar as medições de um cliente
export const listMeasures = async (req: Request, res: Response) => {
  try {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    // Validação do tipo de medição, se fornecido
    if (measure_type && !['WATER', 'GAS'].includes(measure_type as string)) {
      return res.status(400).json({ error_code: 'INVALID_TYPE', error_description: 'Tipo de medição não permitida' });
    }

    // Listar as medições do cliente
    const measures = await MeasureService.listMeasures(customer_code, measure_type as 'WATER' | 'GAS');
    if (measures.length === 0) {
      return res.status(404).json({ error_code: 'MEASURES_NOT_FOUND', error_description: 'Nenhuma leitura encontrada' });
    }

    res.status(200).json({
      customer_code,
      measures
    });

  } catch (error) {
    handleError(error, res);
  }
};
