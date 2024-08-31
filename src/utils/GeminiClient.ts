import axios from 'axios';

// Substitua pelos valores reais
const GEMINI_API_URL = 'https://api.gemini.com'; // URL EX
const GEMINI_API_KEY = 'sua chave';

interface GeminiResponse {
  image_url: string;
  measure_value: number;
  measure_uuid: string; 
}

export class GeminiClient {
  static async processImage(imageBase64: string): Promise<GeminiResponse | null> {
    try {
      const response = await axios.post(
        GEMINI_API_URL,
        { image: imageBase64 },
        {
          headers: {
            'Authorization': `Bearer ${GEMINI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Verifique se a resposta contém os dados esperados
        const data: GeminiResponse = response.data;
        if (data.image_url && data.measure_value !== undefined && data.measure_uuid) {
          return data;
        } else {
          console.error('Unexpected data format from Gemini API:', response.data);
          return null;
        }
      } else {
        console.error('Error from Gemini API:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      // Tipagem específica para erros Axios
      if (axios.isAxiosError(error)) {
        console.error('Error processing image with Gemini:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      return null;
    }
  }
}
