import { useState } from 'react';

function getDataAtual() {
  const hoje = new Date();
  return hoje.toISOString().slice(0, 10); // YYYY-MM-DD
}


export default function MilitarForm() {
  const [codPolicial, setCodPolicial] = useState('');
  const [origem, setOrigem] = useState({ estadoId: '', municipioId: '', batalhaoId: '' });
  const [destino, setDestino] = useState({ estadoId: '', municipioId: '', batalhaoId: '' });
  const [mensagem, setMensagem] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const novaMovimentacao = {
      codPolicial,
      origem: JSON.stringify(origem),
      destino: JSON.stringify(destino),
      data: getDataAtual(),
      status: 'Pendente'
    };
    console.log('Enviando movimentação:', novaMovimentacao);
    fetch('http://localhost:3001/movimentacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaMovimentacao)
    })
      .then(res => {
        console.log('Resposta do backend:', res);
        return res.json();
      })
      .then(data => {
        console.log('Dados recebidos do backend:', data);
        setMensagem('Interesse registrado com sucesso!');
        setCodPolicial('');
        setOrigem({ estadoId: '', municipioId: '', batalhaoId: '' });
        setDestino({ estadoId: '', municipioId: '', batalhaoId: '' });
      })
      .catch((err) => {
        console.error('Erro ao registrar interesse:', err);
        setMensagem('Erro ao registrar interesse.');
      });
  }

  return (
    <div>
      <h3>Registrar Interesse de Realocação</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: 300 }}>
        <input
          value={codPolicial}
          onChange={e => setCodPolicial(e.target.value)}
          placeholder="Código Policial"
          required
        />
        <input
          value={origem.estadoId}
          onChange={e => setOrigem(o => ({ ...o, estadoId: e.target.value }))}
          placeholder="Origem - Estado"
          required
        />
        <input
          value={origem.municipioId}
          onChange={e => setOrigem(o => ({ ...o, municipioId: e.target.value }))}
          placeholder="Origem - Município"
          required
        />
        <input
          value={origem.batalhaoId}
          onChange={e => setOrigem(o => ({ ...o, batalhaoId: e.target.value }))}
          placeholder="Origem - Batalhão"
          required
        />
        <input
          value={destino.estadoId}
          onChange={e => setDestino(d => ({ ...d, estadoId: e.target.value }))}
          placeholder="Destino - Estado"
          required
        />
        <input
          value={destino.municipioId}
          onChange={e => setDestino(d => ({ ...d, municipioId: e.target.value }))}
          placeholder="Destino - Município"
          required
        />
        <input
          value={destino.batalhaoId}
          onChange={e => setDestino(d => ({ ...d, batalhaoId: e.target.value }))}
          placeholder="Destino - Batalhão"
          required
        />
        <button type="submit">Registrar Interesse</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
