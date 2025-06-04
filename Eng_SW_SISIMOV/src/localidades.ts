// src/localidades.ts

export interface Estado {
  id: number;
  nome: string;
}

export interface Municipio {
  id: number;
  estadoId: number;
  nome: string;
}

export type Status = 'Crítico' | 'Médio' | 'Estável';

export interface Battalhao {
  id: number;
  municipioId: number;
  nome: string;
  status: Status;
}

export const estados: Estado[] = [
  { id: 1, nome: 'Minas Gerais' },
  { id: 2, nome: 'São Paulo' },
];

export const municipios: Municipio[] = [
  { id: 1, estadoId: 1, nome: 'Belo Horizonte' },
  { id: 2, estadoId: 1, nome: 'Uberlândia' },
  { id: 3, estadoId: 2, nome: 'Campinas' },
  { id: 4, estadoId: 2, nome: 'São Paulo' },
];

export const batalhoes: Battalhao[] = [
  { id: 1, municipioId: 1, nome: '12º BPM', status: 'Crítico' },
  { id: 2, municipioId: 1, nome: '6º BPM',  status: 'Estável' },
  { id: 3, municipioId: 2, nome: '15ª Cia', status: 'Médio' },
  { id: 4, municipioId: 3, nome: '5ª Cia',  status: 'Estável' },
  { id: 5, municipioId: 4, nome: '9º BPM',  status: 'Crítico' },
];
