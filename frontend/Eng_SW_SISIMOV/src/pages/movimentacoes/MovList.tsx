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
  nome?: string;
  cpf: string;
  origem: {
    municipioId: number;
    batalhaoId: number;
  };
  destino: {
    municipioId: number;
    batalhaoId: number;
  };
  data: string; // ex: '2025-05-31'
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
}

export default function MovList() {
  // --- 1) Histórico de movimentações vindas do backend ---
  const [movs, setMovs] = useState<Movimentacao[]>([]);

  // Buscar movimentações do backend ao carregar a página
  useEffect(() => {
    fetch('http://localhost:3001/movimentacoes')
      .then(res => res.json())
      .then(data => {
        // Converte origem/destino de string para objeto, se necessário
        const movsConvertidos = data.map((m: any) => ({
          ...m,
          origem: typeof m.origem === 'string' ? JSON.parse(m.origem) : m.origem,
          destino: typeof m.destino === 'string' ? JSON.parse(m.destino) : m.destino,
        }));
        setMovs(movsConvertidos);
      })
      .catch(err => {
        console.error('Erro ao buscar movimentações:', err);
      });
  }, []);

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
    municipioId: number,
    batalhaoId: number
  ): string {
    const munObj = municipios.find((m) => m.id === municipioId) as Municipio | undefined;
    const batObj = allBatalhoes.find((b) => b.id === batalhaoId) as Battalhao | undefined;
    const siglaMunicipio = munObj?.sigla ?? '—';
    const nomeBatalhao = batObj?.nome ?? '—';
    return `${siglaMunicipio} / ${nomeBatalhao}`;
  }

  const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  return (
    <div className="mov-container">
      {/* ─── Cabeçalho: “Movimentações” + Botão “Filtrar” ─── */}
      <div className="mov-header">
        <h2>Movimentações</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="mov-filtrar-btn"
            onClick={() => setShowFilter((x) => !x)}
          >
            <FaFilter /> Filtrar
          </button>
          <button
            className="logout-btn"
            style={{ background: '#e74c3c', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ─── Tabela de Histórico de Movimentações ─── */}
      <table className="mov-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Origem (Município / Batalhão)</th>
            <th>Destino (Município / Batalhão)</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {movFiltered.map((m) => (
            <tr key={m.id}>
              <td>{m.nome || '-'}</td>
              <td>{m.cpf}</td>
              <td>
                {getNomeLocal(
                  m.origem.municipioId,
                  m.origem.batalhaoId
                )}
              </td>
              <td>
                {getNomeLocal(
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
                    <strong>Nome:</strong> {m.nome || '-' }
                  </span>
                  <span>
                    <strong>CPF:</strong> {m.cpf}
                  </span>
                  <span>
                    <strong>Origem:</strong>{' '}
                    {getNomeLocal(
                      m.origem.municipioId,
                      m.origem.batalhaoId
                    )}
                  </span>
                  <span>
                    <strong>Destino:</strong>{' '}
                    {getNomeLocal(
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
