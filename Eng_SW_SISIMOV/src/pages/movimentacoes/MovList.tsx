// src/pages/movimentacoes/MovList.tsx
import { useState, useEffect } from 'react';
import { FaFilter, FaCheck, FaTimes } from 'react-icons/fa';

import FiltroLocal from '../../components/filtro';
import type { Sel } from '../../components/filtro';

import {
  estados,
  municipios,
  batalhoes as allBatalhoes,
} from '../../localidades';
import type { Battalhao, Estado, Municipio } from '../../localidades';

import './MovList.css';

/**
 * Tipo de cada movimentação (mock para protótipo)
 */
interface Movimentacao {
  id: number;
  codPolicial: string;
  origem: {
    estadoId: number;
    municipioId: number;
    batalhaoId: number;
  };
  destino: {
    estadoId: number;
    municipioId: number;
    batalhaoId: number;
  };
  data: string; // ex: '2025-05-31'
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
}

export default function MovList() {
  // --- 1) Histórico “mock” de movimentações ---
  const [movs, setMovs] = useState<Movimentacao[]>([
    {
      id: 1,
      codPolicial: '12345',
      origem: { estadoId: 31, municipioId: 312, batalhaoId: 5 },
      destino: { estadoId: 31, municipioId: 313, batalhaoId: 8 },
      data: '2025-01-15',
      status: 'Aprovado',
    },
    {
      id: 2,
      codPolicial: '67890',
      origem: { estadoId: 35, municipioId: 350, batalhaoId: 12 },
      destino: { estadoId: 35, municipioId: 351, batalhaoId: 15 },
      data: '2025-02-20',
      status: 'Rejeitado',
    },
    {
      id: 3,
      codPolicial: '54321',
      origem: { estadoId: 31, municipioId: 312, batalhaoId: 5 },
      destino: { estadoId: 31, municipioId: 314, batalhaoId: 9 }, // exemplo extra
      data: '2025-03-05',
      status: 'Pendente',
    },
    {
      id: 4,
      codPolicial: '98765',
      origem: { estadoId: 35, municipioId: 350, batalhaoId: 12 },
      destino: { estadoId: 31, municipioId: 312, batalhaoId: 5 },
      data: '2025-04-10',
      status: 'Pendente',
    },
  ]);

  // --- 2) Estado para capturar o filtro (origem OU destino) ---
  const [filtro, setFiltro] = useState<Sel>({});
  const [showFilter, setShowFilter] = useState(false);

  // --- 3) Lista filtrada de movimentações ― inicialmente é igual a `movs` ---
  const [movFiltered, setMovFiltered] = useState<Movimentacao[]>(movs);

  // --- 4) Refiltra sempre que `filtro` ou `movs` mudarem ---
  useEffect(() => {
    let arr = [...movs];

    // 4.1) Se houver filtro por batalhão
    if (filtro.batalhao) {
      arr = arr.filter(
        (m) =>
          m.origem.batalhaoId === filtro.batalhao ||
          m.destino.batalhaoId === filtro.batalhao
      );
    }
    // 4.2) Se houver filtro por município (e não há filtro de batalhão)
    else if (filtro.municipio) {
      arr = arr.filter(
        (m) =>
          m.origem.municipioId === filtro.municipio ||
          m.destino.municipioId === filtro.municipio
      );
    }
    // 4.3) Se houver filtro apenas por estado
    else if (filtro.estado) {
      arr = arr.filter(
        (m) =>
          m.origem.estadoId === filtro.estado ||
          m.destino.estadoId === filtro.estado
      );
    }

    // Ordena do mais recente para o mais antigo (comparando strings de data no formato YYYY-MM-DD)
    arr.sort((a, b) => (a.data < b.data ? 1 : -1));
    setMovFiltered(arr);
  }, [filtro, movs]);

  // --- 5) Filtro de “Requerimentos de Aprovação”: status === 'Pendente' ---
  const [pendentes, setPendentes] = useState<Movimentacao[]>([]);
  useEffect(() => {
    setPendentes(movs.filter((m) => m.status === 'Pendente'));
  }, [movs]);

  // --- 6) Funções para Aprovar ou Rejeitar cada movimentação ---
  const aprovar = (id: number) => {
    setMovs((old) =>
      old.map((m) => (m.id === id ? { ...m, status: 'Aprovado' } : m))
    );
  };
  const rejeitar = (id: number) => {
    setMovs((old) =>
      old.map((m) => (m.id === id ? { ...m, status: 'Rejeitado' } : m))
    );
  };

  // --- 7) Monta a string “SIGLA_ESTADO / SIGLA_MUNICIPIO / NOME_BATALHÃO” ---
  function getNomeLocal(
    estadoId: number,
    municipioId: number,
    batalhaoId: number
  ): string {
    const estObj = estados.find((e) => e.id === estadoId) as Estado | undefined;
    const munObj = municipios.find((m) => m.id === municipioId) as
      | Municipio
      | undefined;
    const batObj = allBatalhoes.find((b) => b.id === batalhaoId) as
      | Battalhao
      | undefined;

    // Se não encontrar, exibe “—” (traço)
    const siglaEstado = estObj?.sigla ?? '—';
    const siglaMunicipio = munObj?.sigla ?? '—';
    const nomeBatalhao = batObj?.nome ?? '—';

    return `${siglaEstado} / ${siglaMunicipio} / ${nomeBatalhao}`;
  }

  return (
    <div className="mov-container">
      {/* ─── Cabeçalho: “Movimentações” + Botão “Filtrar” ─── */}
      <div className="mov-header">
        <h2>Movimentações</h2>
        <button
          className="mov-filtrar-btn"
          onClick={() => setShowFilter((x) => !x)}
        >
          <FaFilter /> Filtrar
        </button>
      </div>

      {/* ─── Tabela de Histórico de Movimentações ─── */}
      <table className="mov-table">
        <thead>
          <tr>
            <th>Código Policial</th>
            <th>Origem (E / M / B)</th>
            <th>Destino (E / M / B)</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {movFiltered.map((m) => (
            <tr key={m.id}>
              <td>{m.codPolicial}</td>
              <td>
                {getNomeLocal(
                  m.origem.estadoId,
                  m.origem.municipioId,
                  m.origem.batalhaoId
                )}
              </td>
              <td>
                {getNomeLocal(
                  m.destino.estadoId,
                  m.destino.municipioId,
                  m.destino.batalhaoId
                )}
              </td>
              <td>{m.data}</td>
              <td
                className={
                  m.status === 'Aprovado'
                    ? 'status-aprovado'
                    : m.status === 'Rejeitado'
                    ? 'status-rejeitado'
                    : 'status-pendente'
                }
              >
                {m.status}
              </td>
            </tr>
          ))}
          {movFiltered.length === 0 && (
            <tr>
              <td colSpan={5} className="sem-resultados">
                Nenhuma movimentação encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ─── “Wrapper” para Filtro & Requerimentos ─── */}
      <div className="mov-wrapper">
        {/* COLUNA ESQUERDA: Painel de Filtro (Estado → Município → Batalhão) */}
        {showFilter && (
          <div className="mov-filtro-col">
            <h4>Filtrar Por Local</h4>
            <div className="mov-filtro-cascata">
              <FiltroLocal onFilter={setFiltro} />
            </div>
          </div>
        )}

        {/* COLUNA DIREITA: Requerimentos de Aprovação (Movs com status 'Pendente') */}
        <div className="mov-aprov-col">
          <div className="mov-aprov-container">
            <h3>Requerimentos de Aprovação</h3>
            {pendentes.length === 0 && (
              <p className="sem-pendentes">Não há solicitações pendentes.</p>
            )}
            {pendentes.map((m) => (
              <div key={m.id} className="pendente-card">
                <div className="pendente-info">
                  <span>
                    <strong>Código:</strong> {m.codPolicial}
                  </span>
                  <span>
                    <strong>Origem:</strong>{' '}
                    {getNomeLocal(
                      m.origem.estadoId,
                      m.origem.municipioId,
                      m.origem.batalhaoId
                    )}
                  </span>
                  <span>
                    <strong>Destino:</strong>{' '}
                    {getNomeLocal(
                      m.destino.estadoId,
                      m.destino.municipioId,
                      m.destino.batalhaoId
                    )}
                  </span>
                  <span>
                    <strong>Data:</strong> {m.data}
                  </span>
                </div>
                <div className="pendente-actions">
                  <button
                    className="btn-aprovar"
                    onClick={() => aprovar(m.id)}
                  >
                    <FaCheck /> Aprovar
                  </button>
                  <button
                    className="btn-rejeitar"
                    onClick={() => rejeitar(m.id)}
                  >
                    <FaTimes /> Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
