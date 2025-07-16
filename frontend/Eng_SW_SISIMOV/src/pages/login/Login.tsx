import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import './styles_login.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    usuario: '',
    senha: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Usuários fixos para demonstração
    if (form.usuario === 'militar' && form.senha === '123') {
      localStorage.setItem('auth', 'true');
      localStorage.setItem('usuario', 'militar');
      navigate('/militares');
    } else if (form.usuario === 'comandante' && form.senha === '123') {
      localStorage.setItem('auth', 'true');
      localStorage.setItem('usuario', 'comandante');
      navigate('/movimentacoes');
    } else {
      alert('Usuário ou senha inválidos. Use "militar" ou "comandante" e senha "123".');
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <FaShieldAlt className="badge-icon" />
          <h1>SISIMOV</h1>
        </div>

        <div className="login-field">
          <label>Usuário</label>
          <input
            name="usuario"
            type="text"
            value={form.usuario}
            onChange={handleChange}
            placeholder="militar ou comandante"
          />
        </div>
        <div className="login-field">
          <label>Senha</label>
          <input
            name="senha"
            type="password"
            value={form.senha}
            onChange={handleChange}
            placeholder="123"
          />
        </div>

        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
    </div>
  );
}
