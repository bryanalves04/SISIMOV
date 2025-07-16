import { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';

import FiltroLocal from '../../components/filtro';
import type { Sel } from '../../components/filtro';

import { estados, municipios, batalhoes as allBatalhoes } from '../../localidades';
import type { Battalhao, Municipio, Estado } from '../../localidades';

import './MilitarList.css';

function statusColor(status: Battalhao['status']): string {
  switch (status) {
    case 'Abaixo':
      return 'crimson';
    case 'Estável':
      return 'goldenrod';
    case 'Excedente':
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
  const [cpf, setCpf] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [origem, setOrigem] = useState<Sel>({});
  const [destino, setDestino] = useState<Sel>({});
  const [interesseMsg, setInteresseMsg] = useState<string>('');

  // 5) useEffect: recalcula a lista toda vez que “filtro” mudar
  useEffect(() => {
    let arr = [...allBatalhoes];

    if (filtro.batalhao) {
      arr = arr.filter((b) => b.id === filtro.batalhao);
    } else if (filtro.municipio) {
      arr = arr.filter((b) => b.municipioId === filtro.municipio);
    } else if (filtro.estado) {
      const municipiosDoEstado = municipios
        .filter((m) => m.estadoId === filtro.estado)
        .map((m) => m.id);
      arr = arr.filter((b) => municipiosDoEstado.includes(b.municipioId));
    }

    // Ordena por nome antes de exibir
    arr.sort((a, b) => a.nome.localeCompare(b.nome));
    setBats(arr);
  }, [filtro]);

  // 6) Quando o militar clicar em “Salvar Interesse…” faz POST para /movimentacoes
  const salvarInteresse = () => {
    if (!cpf.trim()) {
      alert('Informe o seu CPF antes de salvar o interesse.');
      return;
    }
    if (!nome.trim()) {
      alert('Informe o seu nome.');
      return;
    }
    if (!destino.batalhao) {
      alert('Selecione um batalhão de destino para registrar seu interesse.');
      return;
    }

    const novaMov = {
      cpf,
      nome,
      origem: JSON.stringify({
        estadoId: origem.estado,
        municipioId: origem.municipio,
        batalhaoId: origem.batalhao,
      }),
      destino: JSON.stringify({
        estadoId: destino.estado,
        municipioId: destino.municipio,
        batalhaoId: destino.batalhao,
      }),
      data: new Date().toISOString().slice(0, 10),
      status: 'Pendente',
    };

    fetch('http://localhost:3001/movimentacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaMov),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setInteresseMsg('Interesse registrado com sucesso! ID: ' + data.id);
        setCpf('');
        setNome('');
        setOrigem({});
        setDestino({});
      })
      .catch((err) => {
        console.error('Erro ao registrar interesse:', err);
        setInteresseMsg('Erro ao registrar interesse.');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  return (
    <div className="militar-container">
      {/* ─── Cabeçalho + Botão Filtrar ─── */}
      <div className="militar-header">
        <h2>Militares (Batalhões)</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="filtrar-btn"
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

      {/* Painel de filtro em cascata (Estado → Município → Batalhão) */}
      {showFilter && (
        <div className="filtro-cascata">
          <FiltroLocal onFilter={setFiltro} />
        </div>
      )}

      {/* Tabela de Batalhões */}
      <table className="batalhao-table">
        <thead>
          <tr>
            <th>BATALHÃO</th>
            <th>MUNICÍPIO</th>
            <th>QUANTIDADE DE VAGAS</th>
            <th>Situação de Efetivo</th>
          </tr>
        </thead>
        <tbody>
          {bats.map((b) => {
            const mun: Municipio | undefined = municipios.find(
              (m) => m.id === b.municipioId
            );
            // Mapeia status para nome exibido e cor
            let vagas = 0;
            let situacao = '';
            switch (b.status) {
              case 'Crítico':
                vagas = 10;
                situacao = 'Abaixo';
                break;
              case 'Médio':
                vagas = 5;
                situacao = 'Estável';
                break;
              case 'Estável':
                vagas = 0;
                situacao = 'Excedente';
                break;
              default:
                vagas = 0;
                situacao = '-';
            }
            return (
              <tr key={b.id}>
                <td>{b.nome}</td>
                <td>{mun?.nome || '—'}</td>
                <td>{vagas}</td>
                <td style={{ color: statusColor(situacao), fontWeight: 'bold' }}>
                  {situacao}
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

      {/* Formulário “Registrar Interesse de Realocação” */}
      <div className="interesse-container">
        <h3>Registrar Interesse de Realocação</h3>

        {/* Campo para Código Policial */}
        <div className="input-group">
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Seu nome completo"
            required
          />
        </div>
        <div className="input-group">
          <label>CPF</label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="Seu CPF"
            required
          />
        </div>

        <p>Selecione sua <strong>origem</strong> e seu <strong>destino</strong>:</p>

        {/* Origem: Município → Batalhão */}
        <div className="input-group" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label>Origem - Município</label>
            <select
              value={origem.municipio || ''}
              onChange={(e) =>
                setOrigem((prev) => ({
                  municipio: Number(e.target.value) || undefined,
                  batalhao: undefined,
                }))
              }
            >
              <option value="">Selecione Município</option>
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>
          </div>

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

        {/* Destino: Município → Batalhão */}
        <div className="input-group" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label>Destino - Município</label>
            <select
              value={destino.municipio || ''}
              onChange={(e) =>
                setDestino((prev) => ({
                  municipio: Number(e.target.value) || undefined,
                  batalhao: undefined,
                }))
              }
            >
              <option value="">Selecione Município</option>
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>
          </div>

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

        <button className="salvar-btn" onClick={salvarInteresse}>
          Salvar Interesse
        </button>

        {interesseMsg && <p className="interesse-msg">{interesseMsg}</p>}
      </div>
    </div>
  );
}
