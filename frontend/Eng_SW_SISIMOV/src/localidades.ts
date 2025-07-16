// src/localidades.ts

export interface Estado {
  id: number;
  nome: string;   // ex: "Minas Gerais"
  sigla: string;  // ex: "MG"
}

export interface Municipio {
  id: number;
  estadoId: number;
  nome: string;   // ex: "Belo Horizonte"
  sigla: string;  // ex: "BH"
}

export interface Battalhao {
  id: number;
  municipioId: number;
  nome: string;        // ex: "9º BPM"
  status: 'Crítico' | 'Médio' | 'Estável';
}

// Dados de exemplo (mock)
export const estados: Estado[] = [
  { id: 31, nome: 'Minas Gerais', sigla: 'MG' },
  { id: 35, nome: 'São Paulo', sigla: 'SP' },
  // … outros estados
];

export const municipios: Municipio[] = [
  { id: 312, estadoId: 31, nome: 'Belo Horizonte', sigla: 'BH' },
  { id: 314, estadoId: 31, nome: 'Betim', sigla: 'BET' },
  { id: 315, estadoId: 31, nome: 'Ribeirão das Neves', sigla: 'NEV' },
  { id: 316, estadoId: 31, nome: 'Dores do Indaiá', sigla: 'DI' },
  { id: 317, estadoId: 31, nome: 'Contagem', sigla: 'CON' },
  { id: 318, estadoId: 31, nome: 'Ibirité', sigla: 'IBI' },
  // Apenas MG
];

export const batalhoes: Battalhao[] = [
  // Belo Horizonte
  { id: 5, municipioId: 312, nome: '9º BPM', status: 'Estável' },
  { id: 6, municipioId: 312, nome: '1º BPM', status: 'Médio' },
  { id: 7, municipioId: 312, nome: '22º BPM', status: 'Crítico' },
  // Betim
  { id: 20, municipioId: 314, nome: '33º BPM', status: 'Estável' },
  // Neves
  { id: 30, municipioId: 315, nome: '40º BPM', status: 'Médio' },
  // Dores do Indaiá
  { id: 40, municipioId: 316, nome: '50º BPM', status: 'Crítico', vagas: 40 },
  // Contagem
  { id: 50, municipioId: 317, nome: '18º BPM', status: 'Crítico' },
  { id: 51, municipioId: 317, nome: '39º BPM', status: 'Médio' },
  // Ibirité
  { id: 60, municipioId: 318, nome: '48º BPM', status: 'Estável' },
];
