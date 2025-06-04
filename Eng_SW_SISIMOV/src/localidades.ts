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
  { id: 313, estadoId: 31, nome: 'Uberlândia', sigla: 'UB' },
  { id: 350, estadoId: 35, nome: 'Campinas', sigla: 'CA' },
  { id: 351, estadoId: 35, nome: 'São Paulo', sigla: 'SP' },
  // … outros municípios
];

export const batalhoes: Battalhao[] = [
  { id: 5, municipioId: 312, nome: '9º BPM', status: 'Estável' },
  { id: 8, municipioId: 313, nome: '14º BPM', status: 'Crítico' },
  { id: 12, municipioId: 350, nome: '5ª Cia', status: 'Médio' },
  { id: 15, municipioId: 351, nome: '15ª Cia', status: 'Estável' },
  // … outros batalhões
];
