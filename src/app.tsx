import React from "react";
import { Grid } from "./grid/grid";
import { IncreaseCommand } from "./commands/increase-command";
import { DecreaseCommand } from "./commands/decrease-command";
import { PrintSumCommand } from "./commands/print-sum-command";
import { RenameCommand } from "./commands/rename-command";
import "spectre.css/dist/spectre.css";
import "spectre.css/dist/spectre-exp.css";
import "spectre.css/dist/spectre-icons.css";
import "./app.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <Grid
        commands={[
          IncreaseCommand,
          DecreaseCommand,
          PrintSumCommand,
          RenameCommand
        ]}
      />
    </div>
  );
};

export default App;
