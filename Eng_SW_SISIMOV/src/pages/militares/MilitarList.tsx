// src/pages/militares/MilitarList.tsx
import { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';

import FiltroLocal from '../../components/filtro';
import type { Sel } from '../../components/filtro';

import { estados, municipios, batalhoes as allBatalhoes } from '../../localidades';
import type { Battalhao, Municipio, Estado } from '../../localidades';

import './MilitarList.css'; // CSS de estilização

function statusColor(status: Battalhao['status']): string {
  switch (status) {
    case 'Crítico':
      return 'crimson';
    case 'Médio':
      return 'goldenrod';
    case 'Estável':
      return 'lightgreen';
    default:
      return 'white';
  }
}

export default function MilitarList() {
  // 1) Lista completa de batalhões (ordenada por nome inicialmente)
  const [bats, setBats] = useState<Battalhao[]>(() =>
    [...allBatalhoes].sort((a, b) => a.nome.localeCompare(b.nome))
  );

  // 2) Objeto filtro: { estado?, municipio?, batalhao? }
  const [filtro, setFiltro] = useState<Sel>({});
  // 3) Controla se o painel de filtro está visível
  const [showFilter, setShowFilter] = useState(false);

  // 4) Estados do formulário “Registrar Interesse de Realocação”
  const [codPolicial, setCodPolicial] = useState<string>('');
  const [origem, setOrigem] = useState<Sel>({});
  const [destino, setDestino] = useState<Sel>({});
  const [interesseMsg, setInteresseMsg] = useState<string>('');

  // 5) useEffect: recalcula a lista toda vez que “filtro” mudar
  useEffect(() => {
    let arr = [...allBatalhoes];

    if (filtro.batalhao) {
      // Se filtrou diretamente por batalhão
      arr = arr.filter((b) => b.id === filtro.batalhao);
    } else if (filtro.municipio) {
      // Filtra todos os batalhões daquele município
      arr = arr.filter((b) => b.municipioId === filtro.municipio);
    } else if (filtro.estado) {
      // Filtra por estado: pega todos os municípios daquele estado, depois filtra por eles
      const municipiosDoEstado = municipios
        .filter((m) => m.estadoId === filtro.estado)
        .map((m) => m.id);
      arr = arr.filter((b) => municipiosDoEstado.includes(b.municipioId));
    }

    // Ordena por nome antes de exibir
    arr.sort((a, b) => a.nome.localeCompare(b.nome));
    setBats(arr);
  }, [filtro]);

  // 6) Quando o militar clicar em “Salvar Interesse…”
  const salvarInteresse = () => {
    if (!codPolicial.trim()) {
      alert('Informe o seu Código Policial antes de salvar o interesse.');
      return;
    }
    if (!destino.batalhao) {
      alert('Selecione um batalhão de destino para registrar seu interesse.');
      return;
    }
    const oriBatt = allBatalhoes.find((b) => b.id === origem.batalhao)?.nome || 'Indefinido';
    const dstBatt = allBatalhoes.find((b) => b.id === destino.batalhao)?.nome || 'Indefinido';
    const msg =
      `Interesse registrado:\n` +
      `Código Policial: ${codPolicial}\n` +
      `Origem: ${oriBatt}\n` +
      `Destino: ${dstBatt}`;
    setInteresseMsg(msg);
    alert(msg);
  };

  return (
    <div className="militar-container">
      {/* ─── Cabeçalho + Botão Filtrar ─── */}
      <div className="militar-header">
        <h2>Militares (Batalhões)</h2>
        <button
          className="filtrar-btn"
          onClick={() => setShowFilter((x) => !x)}
        >
          <FaFilter /> Filtrar
        </button>
      </div>

      {/* ─── Painel de filtro em cascata (Estado → Município → Batalhão) ─── */}
      {showFilter && (
        <div className="filtro-cascata">
          <FiltroLocal onFilter={setFiltro} />
        </div>
      )}

      {/* ─── Tabela de Batalhões ─── */}
      <table className="batalhao-table">
        <thead>
          <tr>
            <th>BATALHÃO</th> 
            <th>MUNICÍPIO</th>
             <th>ESTADO</th> 
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {bats.map((b) => {
            // Procura o município e o estado correspondentes
            const mun: Municipio | undefined = municipios.find(
              (m) => m.id === b.municipioId
            );
            const est: Estado | undefined = estados.find(
              (e) => e.id === (mun?.estadoId ?? -1)
            );
            return (
              <tr key={b.id}>
                <td>{b.nome}</td>
                <td>{mun?.nome || '—'}</td>
                <td>{est?.nome || '—'}</td>
                <td style={{ color: statusColor(b.status), fontWeight: 'bold' }}>
                  {b.status}
                </td>
              </tr>
            );
          })}
          {bats.length === 0 && (
            <tr>
              <td colSpan={4} className="sem-resultados">
                Nenhum batalhão encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ─── Formulário “Registrar Interesse de Realocação” ─── */}
      <div className="interesse-container">
        <h3>Registrar Interesse de Realocação</h3>

        {/* Campo para Código Policial */}
        <div className="input-group">
          <label>Código Policial</label>
          <input
            type="text"
            value={codPolicial}
            onChange={(e) => setCodPolicial(e.target.value)}
            placeholder="Seu código policial"
          />
        </div>

        <p>Selecione sua <strong>origem</strong> e seu <strong>destino</strong>:</p>

        {/* Origem: Estado → Município → Batalhão */}
        <div className="input-group" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {/* Origem - Estado */}
          <div style={{ flex: 1 }}>
            <label>Origem - Estado</label>
            <select
              value={origem.estado || ''}
              onChange={(e) =>
                setOrigem({ estado: Number(e.target.value) || undefined })
              }
            >
              <option value="">Selecione Estado</option>
              {estados.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Origem - Município */}
          <div style={{ flex: 1 }}>
            <label>Origem - Município</label>
            <select
              value={origem.municipio || ''}
              onChange={(e) =>
                setOrigem((prev) => ({
                  ...prev,
                  municipio: Number(e.target.value) || undefined,
                  batalhao: undefined,
                }))
              }
              disabled={!origem.estado}
            >
              <option value="">Selecione Município</option>
              {municipios
                .filter((m) => m.estadoId === origem.estado)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
            </select>
          </div>

          {/* Origem - Batalhão */}
          <div style={{ flex: 1 }}>
            <label>Origem - Batalhão</label>
            <select
              value={origem.batalhao || ''}
              onChange={(e) =>
                setOrigem((prev) => ({
                  ...prev,
                  batalhao: Number(e.target.value) || undefined,
                }))
              }
              disabled={!origem.municipio}
            >
              <option value="">Selecione Batalhão</option>
              {allBatalhoes
                .filter((b) => b.municipioId === origem.municipio)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nome}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Destino: Estado → Município → Batalhão */}
        <div className="input-group" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {/* Destino - Estado */}
          <div style={{ flex: 1 }}>
            <label>Destino - Estado</label>
            <select
              value={destino.estado || ''}
              onChange={(e) =>
                setDestino({ estado: Number(e.target.value) || undefined })
              }
            >
              <option value="">Selecione Estado</option>
              {estados.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Destino - Município */}
          <div style={{ flex: 1 }}>
            <label>Destino - Município</label>
            <select
              value={destino.municipio || ''}
              onChange={(e) =>
                setDestino((prev) => ({
                  ...prev,
                  municipio: Number(e.target.value) || undefined,
                  batalhao: undefined,
                }))
              }
              disabled={!destino.estado}
            >
              <option value="">Selecione Município</option>
              {municipios
                .filter((m) => m.estadoId === destino.estado)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
            </select>
          </div>

          {/* Destino - Batalhão */}
          <div style={{ flex: 1 }}>
            <label>Destino - Batalhão</label>
            <select
              value={destino.batalhao || ''}
              onChange={(e) =>
                setDestino((prev) => ({
                  ...prev,
                  batalhao: Number(e.target.value) || undefined,
                }))
              }
              disabled={!destino.municipio}
            >
              <option value="">Selecione Batalhão</option>
              {allBatalhoes
                .filter((b) => b.municipioId === destino.municipio)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nome}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Botão de salvar interesse */}
        <button className="salvar-btn" onClick={salvarInteresse}>
          Salvar Interesse
        </button>

        {interesseMsg && <p className="interesse-msg">{interesseMsg}</p>}
      </div>
    </div>
  );
}
