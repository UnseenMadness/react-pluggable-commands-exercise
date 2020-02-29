import React from 'react';
import { Grid } from './grid/grid';
import { IncreaseCommand, DecreaseCommand, PrintSumCommand, RenameCommand, CommandProps, RenderState } from "./commands/commands";
import 'spectre.css/dist/spectre.css';
import 'spectre.css/dist/spectre-exp.css';
import 'spectre.css/dist/spectre-icons.css';
import './app.css';

const App: React.FC = () => {
  
  const props: CommandProps ={
    ClickHandler: () => { },
    renderState: RenderState.toolbarButton,
    selection: []
  };
  return (
      
    < div className = "app" >
      <Grid commands={[
        new IncreaseCommand(props),
        new DecreaseCommand(props),
        new PrintSumCommand(props),
        new RenameCommand(props)
      ]} />
    </div >
  );
};

export default App;
