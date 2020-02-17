import React from 'react';
import { Grid } from './grid/grid';
import 'spectre.css/dist/spectre.css';
import 'spectre.css/dist/spectre-exp.css';
import 'spectre.css/dist/spectre-icons.css';
import './app.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <Grid />
    </div>
  );
};

export default App;
