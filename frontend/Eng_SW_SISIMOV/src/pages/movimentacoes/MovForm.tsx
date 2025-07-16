
import { useState } from 'react';
import { municipios, batalhoes as allBatalhoes } from '../../localidades';

type OrigemDestino = { municipio: number | undefined; batalhao: number | undefined };
export default function MovForm() {
  const [cpf, setCpf] = useState('');
  const [origem, setOrigem] = useState<OrigemDestino>({ municipio: undefined, batalhao: undefined });
  const [destino, setDestino] = useState<OrigemDestino>({ municipio: undefined, batalhao: undefined });
  const [mensagem, setMensagem] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const novaMov = {
      cpf,
      origem: JSON.stringify({
        municipioId: origem.municipio,
        batalhaoId: origem.batalhao,
      }),
      destino: JSON.stringify({
        municipioId: destino.municipio,
        batalhaoId: destino.batalhao,
      }),
      data: new Date().toISOString().slice(0, 10),
      status: 'Pendente',
    };
    fetch('http://localhost:3001/movimentacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaMov)
    })
      .then(res => res.json())
      .then(data => {
        setMensagem('Movimentação cadastrada com sucesso!');
        setCpf('');
        setOrigem({ municipio: undefined, batalhao: undefined });
        setDestino({ municipio: undefined, batalhao: undefined });
      })
      .catch(() => setMensagem('Erro ao cadastrar movimentação.'));
  }

  return (
    <div>
      <h3>Cadastrar Movimentação</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: 300 }}>
        <input
          value={cpf}
          onChange={e => setCpf(e.target.value)}
          placeholder="CPF do Militar"
          required
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Origem - Município</label>
            <select
              value={origem.municipio || ''}
              onChange={e => setOrigem({ municipio: Number(e.target.value) || undefined, batalhao: undefined })}
            >
              <option value="">Selecione Município</option>
              {municipios.filter(m => m.estadoId === 31).map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Origem - Batalhão</label>
            <select
              value={origem.batalhao || ''}
              onChange={e => setOrigem(o => ({ ...o, batalhao: Number(e.target.value) || undefined }))}
              disabled={!origem.municipio}
            >
              <option value="">Selecione Batalhão</option>
              {allBatalhoes.filter(b => b.municipioId === origem.municipio).map(b => (
                <option key={b.id} value={b.id}>{b.nome}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Destino - Município</label>
            <select
              value={destino.municipio || ''}
              onChange={e => setDestino({ municipio: Number(e.target.value) || undefined, batalhao: undefined })}
            >
              <option value="">Selecione Município</option>
              {municipios.filter(m => m.estadoId === 31).map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Destino - Batalhão</label>
            <select
              value={destino.batalhao || ''}
              onChange={e => setDestino(o => ({ ...o, batalhao: Number(e.target.value) || undefined }))}
              disabled={!destino.municipio}
            >
              <option value="">Selecione Batalhão</option>
              {allBatalhoes.filter(b => b.municipioId === destino.municipio).map(b => (
                <option key={b.id} value={b.id}>{b.nome}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" style={{ marginTop: 12 }}>Cadastrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
