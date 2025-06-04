// src/routes.tsx
import { createBrowserRouter } from 'react-router-dom';

// 1) importe o Login
import Login        from './pages/login/Login';

import App          from './pages/App/App';
import Dashboard    from './pages/dashboard/DashBoard';
import MilitarList  from './pages/militares/MilitarList';
import MilitarForm  from './pages/militares/militarForm';
import MovList      from './pages/movimentacoes/MovList';
import MovForm      from './pages/movimentacoes/MovForm';

export const router = createBrowserRouter([
  // 2) rota pública de login
  { path: '/login', element: <Login /> },

  // 3) layout principal com suas páginas-filhas
  {
    path: '/',
    element: <App />,
    children: [
      { index: true,                    element: <Dashboard /> },
      { path: 'militares',              element: <MilitarList /> },
      { path: 'militares/novo',         element: <MilitarForm /> },
      { path: 'militares/:id',          element: <MilitarForm /> },
      { path: 'movimentacoes',          element: <MovList /> },
      { path: 'movimentacoes/nova',     element: <MovForm /> },
      { path: 'movimentacoes/:id',      element: <MovForm /> },
    ],
  },
]);
