import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainContainer from './MainScreen';

export default function App() {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<MainContainer />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
