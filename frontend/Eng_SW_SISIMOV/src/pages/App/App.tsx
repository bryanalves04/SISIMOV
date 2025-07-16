// src/App.tsx
import { NavLink, Outlet } from 'react-router-dom';
import './App.css';

export default function App() {
  // Verifica tipo de usuário logado
  let tipoUsuario = '';
  try {
    tipoUsuario = localStorage.getItem('usuario') || '';
  } catch {}

  return (
    <div className="app-container">
      <header className="main-header">
        <nav className="nav-bar">
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
                end
              >
                Dashboard
              </NavLink>
            </li>
            {tipoUsuario === 'militar' && (
              <li>
                <NavLink
                  to="/militares"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  Militares
                </NavLink>
              </li>
            )}
            {tipoUsuario === 'comandante' && (
              <li>
                <NavLink
                  to="/movimentacoes"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  Movimentações
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
