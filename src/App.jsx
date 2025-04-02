// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CadastroPessoa from './pages/Cadastro/index';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout><CadastroPessoa /></Layout>} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
