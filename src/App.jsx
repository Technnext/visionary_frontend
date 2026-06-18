import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './css/global.css';
import ScrollToTop from "./components/common/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}
