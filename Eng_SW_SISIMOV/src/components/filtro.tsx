// src/components/FiltroLocal.tsx
import { useState } from 'react';
import { estados, municipios, batalhoes} from '../localidades';

export interface Sel {
  estado?: number;
  municipio?: number;
  batalhao?: number;
}

interface Props {
  onFilter: (sel: Sel) => void;
}

export default function FiltroLocal({ onFilter }: Props) {
  const [sel, setSel] = useState<Sel>({});

  function handleChange<K extends keyof Sel>(field: K, value: number | undefined) {
    // Se mudar estado, reseta município e batalhão
    // Se mudar município, reseta batalhão
    let next: Sel;
    if (field === 'estado') {
      next = { estado: value, municipio: undefined, batalhao: undefined };
    } else if (field === 'municipio') {
      next = { ...sel, municipio: value, batalhao: undefined };
    } else {
      next = { ...sel, batalhao: value };
    }
    setSel(next);
    onFilter(next);
  }

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
      <select
        value={sel.estado || ''}
        onChange={e => handleChange('estado', Number(e.target.value) || undefined)}
      >
        <option value="">Estado</option>
        {estados.map(e => (
          <option key={e.id} value={e.id}>
            {e.nome}
          </option>
        ))}
      </select>

      <select
        value={sel.municipio || ''}
        onChange={e => handleChange('municipio', Number(e.target.value) || undefined)}
        disabled={!sel.estado}
      >
        <option value="">Município</option>
        {municipios
          .filter(m => m.estadoId === sel.estado)
          .map(m => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
      </select>

      <select
        value={sel.batalhao || ''}
        onChange={e => handleChange('batalhao', Number(e.target.value) || undefined)}
        disabled={!sel.municipio}
      >
        <option value="">Batalhão</option>
        {batalhoes
          .filter(b => b.municipioId === sel.municipio)
          .map(b => (
            <option key={b.id} value={b.id}>
              {b.nome}
            </option>
          ))}
      </select>
    </div>
  );
}
