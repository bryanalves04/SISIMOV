interface Mov {
  id: number;
  militar: string;
  origem: string;
  destino: string;
}

const mockMov: Mov[] = [
  { id: 1, militar: 'João Silva', origem: '12º BPM', destino: '4ª Cia' },
];

export default function MovList() {
  return (
    <>
      <h2>Movimentações</h2>
      <table>
        <thead>
          <tr><th>Militar</th><th>Origem</th><th>Destino</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {mockMov.map(m => (
            <tr key={m.id}>
              <td>{m.militar}</td><td>{m.origem}</td><td>{m.destino}</td>
              <td>(botões aqui)</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="green">+ Nova Movimentação</button>
    </>
  );
}
