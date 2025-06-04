import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import './styles_login.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    codPolicial: '',
    cpf: '',
    nome: '',
    senha: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (form.codPolicial && form.senha) {
      localStorage.setItem('auth', 'true');
      navigate('/');
    } else {
      alert('Preencha todos os campos para entrar.');
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <FaShieldAlt className="badge-icon" />
          <h1>SISIMOV</h1>
        </div>

        {['codPolicial', 'senha'].map(field => (
          <div className="login-field" key={field}>
            <label>
              {{
                codPolicial: 'Código Policial',
                senha: 'Senha',
              }[field]}
            </label>
            <input
              name={field}
              type={field === 'senha' ? 'password' : 'text'}
              value={(form as any)[field]}
              onChange={handleChange}
              placeholder={
                {
                  codPolicial: 'ex: 12345',
                  cpf: '000.000.000-00',
                  nome: 'Seu nome completo',
                  senha: '••••••••',
                }[field]
              }
            />
          </div>
        ))}

        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
    </div>
  );
}
