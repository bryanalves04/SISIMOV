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
  const statsPorEstado = useMemo(() => {
    return estados.map((est) => {
      // 1) Filtra todos os batalhões cujo município pertence a esse estado:
      const batalhoesDoEstado: Battalhao[] = allBatalhoes.filter((b) => {
        const mun = municipios.find((m) => m.id === b.municipioId);
        return mun?.estadoId === est.id;
      });

      // 2) Conta quantos batalhões estão em cada status:
      let totalCritico = 0;
      let totalMedio = 0;
      let totalEstavel = 0;
      batalhoesDoEstado.forEach((b) => {
        if (b.status === 'Crítico') totalCritico += 1;
        else if (b.status === 'Médio') totalMedio += 1;
        else if (b.status === 'Estável') totalEstavel += 1;
      });

      return {
        estado: est,
        totalCritico,
        totalMedio,
        totalEstavel,
        totalGeral: batalhoesDoEstado.length,
      };
    });
  }, []);

  return (
    <div className="dash-container">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* Cabeçalho da Dashboard (título e botões de login “fake”)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="dash-header">
        <h1 className="dash-title">Situação do Efetivo Policial</h1>
        <div className="dash-login-buttons">
          <button className="btn-login-militar">Login como Militar</button>
          <button className="btn-login-comandante">Login como Comandante</button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* Painel de Estatísticas por Estado (cartões em grade)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="dash-stats-grid">
        {statsPorEstado.map((stat) => (
          <div key={stat.estado.id} className="dash-stat-card">
            <h2 className="card-estado-nome">{stat.estado.nome} ({stat.estado.sigla})</h2>
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
          </div>
        ))}
      </section>
    </div>
  );
}
