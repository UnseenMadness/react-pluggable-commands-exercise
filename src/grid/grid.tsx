/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import GridItem from './grid-item';

export interface ICommand {
  toolBarButtonRender: (selection: Row[], runCommand: () => void) => JSX.Element | null;
  contextMenuItemRender: (row: Row, runCommand: () => void) => JSX.Element | null;
  Component: React.ComponentType<CommandProps>;
}

export interface CommandProps {
  processing: Row[];
  onCommandComplete(updated: Row[]): void;
}

interface State {
  // grid itself state
  rows: Row[]; // all rows
  selection: Row[]; // currently selected rows
  processing: Row[]; // rows currently processed by some command
  runningCommand: number
}


export class Row {
  id: string;
  name: string;
  amount: number;
  constructor(id: string, name: string, amount: number, newName: string) {
    this.id = id;
    this.name = name;
    this.amount = amount;
  }
}

interface Props {
  commands: ICommand[]
}

export class Grid extends React.Component<Props, State> {
  state: Readonly<State> = {
    rows: [
      {
        id: Math.random()
          .toString(36)
          .slice(2),
        name: 'One',
        amount: 0,
      },
      {
        id: Math.random()
          .toString(36)
          .slice(2),
        name: 'Two',
        amount: 16,
      },
      {
        id: Math.random()
          .toString(36)
          .slice(2),
        name: 'Three',
        amount: 0,
      },
      {
        id: Math.random()
          .toString(36)
          .slice(2),
        name: 'Const',
        amount: 42,
      },
    ],
    selection: [],
    processing: [],
    runningCommand: 0,
  };

  handleSelectToggle = (row: any) => {
    const { selection } = this.state;
    if (selection.indexOf(row) === -1) {
      this.setState({ selection: [...selection, row] });
    } else {
      this.setState({ selection: selection.filter(item => item !== row) });
    }
  };

  handleCommandComplete = (updatedItems: any[] = []) => {
    const updatedRows = this.state.rows.map(row => updatedItems.find(item => item.id === row.id) || row);
    const updatedSelection = this.state.selection.map(row => updatedItems.find(item => item.id === row.id) || row);
    this.setState({
      rows: updatedRows,
      selection: updatedSelection,
      processing: [],
      runningCommand: -1,
    });
  };

  render() {
    const { rows, selection, runningCommand } = this.state;
    const commands = this.props.commands.slice();
    return (
      <div className="grid-page">
        <div>
          Toolbar:&nbsp;
          <div className="btn-group">
            {
              commands.map((command, i) => command.toolBarButtonRender(
                selection,
                () => this.setState({ processing: selection.slice(), runningCommand: i }),
              ))
            }
          </div>
        </div>
        {
          runningCommand !== -1 && React.createElement(commands[runningCommand].Component, {
            processing: this.state.processing || [],
            onCommandComplete: this.handleCommandComplete,
          })
        }
        <ul className="grid">
          {rows.map(row => {
            return (
              <GridItem
                key={row.id}
                row={row}
                isSelected={selection.indexOf(row) !== -1}
                onSelectToggle={this.handleSelectToggle}
                contextMenu={
                  <>
                    {
                      commands.map((command, i) => command.contextMenuItemRender(
                        row,
                        () => this.setState({ processing: [row], runningCommand: i }),
                      ))
                    }
                  </>
                }
              />
            );
          })}
        </ul>
      </div >
    );
  }
}
