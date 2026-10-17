import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { MembersPage } from './pages/MembersPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
