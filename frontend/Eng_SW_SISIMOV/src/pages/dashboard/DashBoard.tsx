// src/pages/dashboard/DashBoard.tsx
import { useMemo } from 'react';
import { estados, municipios, batalhoes as allBatalhoes } from '../../localidades';
import type { Estado, Municipio, Battalhao } from '../../localidades';
import './DashBoard.css';

/**
 * DashBoard: 
 * - Exibe um resumo do efetivo policial por estado (quantidade de batalhões em cada status: Crítico, Médio, Estável).
 * - Providencia, como protótipo visual, botões “Login como Militar” e “Login como Comandante”.
 * - Mantém o mesmo padrão de cores e layout das outras páginas (background azul degradê, títulos em dourado, painéis escuros).
 */
export default function DashBoard() {
  /**
   * statsPorEstado: array de objetos onde cada item agrupa, para um estado específico:
   *  { estado: Estado, totalCritico: number, totalMedio: number, totalEstavel: number, totalGeral: number }
   */
  // Mock de estatísticas por cidade de MG
  const cidadesMG = [
    { nome: 'Belo Horizonte', sigla: 'BH' },
    { nome: 'Betim', sigla: 'BET' },
    { nome: 'Ribeirão das Neves', sigla: 'NEV' },
    { nome: 'Dores do Indaiá', sigla: 'DI' },
    { nome: 'Contagem', sigla: 'CON' },
    { nome: 'Ibirité', sigla: 'IBI' },
  ];
  // Mock: cada cidade recebe números aleatórios para cada status
  const statsPorCidade = cidadesMG.map((cidade, idx) => {
    // Para visual, alterna valores
    const totalCritico = [2, 1, 0, 1, 2, 0][idx];
    const totalMedio = [1, 2, 1, 0, 1, 2][idx];
    const totalEstavel = [2, 1, 2, 2, 1, 1][idx];
    const totalGeral = totalCritico + totalMedio + totalEstavel;
    // Lógica de vagas igual à tela de militares
    const totalVagas = (totalCritico * 10) + (totalMedio * 5) + (totalEstavel * 2);
    return {
      cidade,
      totalCritico,
      totalMedio,
      totalEstavel,
      totalGeral,
      totalVagas,
    };
  });

  return (
    <div className="dash-container">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* Cabeçalho da Dashboard (título e botões de login “fake”)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="dash-header">
        <h1 className="dash-title">Situação do Efetivo Policial</h1>
        <div className="dash-login-buttons">
          <button
            className="btn-login-unico"
            style={{
              background: 'linear-gradient(90deg, #FFD700 0%, #FFC300 100%)',
              color: '#1a1a2e',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: 8,
              padding: '12px 32px',
              fontSize: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #FFC300 0%, #FFD700 100%)')}
            onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #FFD700 0%, #FFC300 100%)')}
            onClick={() => window.location.href = '/login'}
          >
            Login
          </button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Painel de Estatísticas por Estado (cartões em grade)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="dash-stats-grid">
        {statsPorCidade.map((stat, idx) => (
          <div key={stat.cidade.sigla} className="dash-stat-card">
            <h2 className="card-estado-nome">{stat.cidade.nome} ({stat.cidade.sigla})</h2>
            <div className="card-status-row">
              <span className="status-label">Crítico:</span>
              <span className="status-value status-crítico">{stat.totalCritico}</span>
            </div>
            <div className="card-status-row">
              <span className="status-label">Médio:</span>
              <span className="status-value status-médio">{stat.totalMedio}</span>
            </div>
            <div className="card-status-row">
              <span className="status-label">Estável:</span>
              <span className="status-value status-estável">{stat.totalEstavel}</span>
            </div>
            <div className="card-status-row total-row">
              <span className="status-label">Total Batalhões:</span>
              <span className="status-value status-total">{stat.totalGeral}</span>
            </div>
            <div className="card-status-row total-row">
              <span className="status-label">Total de Vagas:</span>
              <span className="status-value status-total">{stat.totalVagas}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
