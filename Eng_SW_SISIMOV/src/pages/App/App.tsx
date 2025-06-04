// src/App.tsx
import { NavLink, Outlet } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
    <div className="app-container">
      {/* ─── Header fixo no topo ─── */}
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
          </ul>
        </nav>
      </header>

      {/* ─── Área que abrigará todas as rotas (Dashboard, Militares, Movimentações) ─── */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
