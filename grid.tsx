/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import GridItem from './grid-item';
import { ICommand, CommandProps, RenderState } from '../commands/commands';

interface State {
  // grid itself state
  rows: Row[]; // all rows
  selection: Row[]; // currently selected rows
  processing: Row[]; // rows currently processed by some command
  needDialog: boolean
  runningCommand: number
}


export class Row {
  id: string;
  name: string;
  newName: string;
  amount: number;
  constructor(id: string, name: string, amount: number, newName: string) {
    this.id = id;
    this.name = name;
    this.newName = newName;
    this.amount = amount;
  }
}

interface Props {
  commands: ICommand[]
}


export class Grid extends React.Component<Props, State> {
  static defaultComponents: Props = {
    commands: []
  }
  state: Readonly<State> = {
    rows: [
      {
        id: Math.random()
          .toString(36)
          .slice(2),
        name: 'One',
        amount: 0,
        newName: 'One',
      },
      {
        id: Math.random()
          .toString(36)
          .slice(2),
        name: 'Two',
        amount: 16,
        newName: 'Two',
      },
      {
        id: Math.random()
          .toString(36)
          .slice(2),
        name: 'Three',
        amount: 0,
        newName: 'Three',
      },
      {
        id: Math.random()
          .toString(36)
          .slice(2),
        name: 'Const',
        amount: 42,
        newName: 'Const',
      },
    ],
    selection: [],
    processing: [],
    needDialog: false,
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
      needDialog: false,
      runningCommand: 0
    });
  };

  runCommand = (needDialog: boolean, commandIndex: number, updated: Row[]) => {
    this.setState({ needDialog: needDialog, runningCommand: commandIndex }, () => {
      if (needDialog)
        this.forceUpdate();
      else 
        window.setTimeout(() => this.handleCommandComplete(updated), 100);
    });
  }

  render() {
    const { rows, selection, needDialog, runningCommand } = this.state;
    const commands = this.props.commands.slice();
    return (
      <div className="grid-page">
        <div>
          Toolbar:&nbsp;
          <div className="btn-group">
            {
              commands.map((command, i) => {
                const props: CommandProps = {
                  renderState: RenderState.toolbarButton,
                  selection: selection,
                  ClickHandler: (neeDialog: boolean, updated: Row[]) => { this.setState({ processing: selection.slice() }, () => this.runCommand(neeDialog, i, updated)) },
                }
                return command.getElement(props);
              })
            }
          </div>
        </div>
        {
          needDialog && (
            commands[runningCommand].getElement({
              renderState: RenderState.dialog,
              selection: this.state.processing ?? [],
              ClickHandler: (neeDialog: boolean, updated: Row[]) => { this.runCommand(neeDialog, this.state.runningCommand, updated) },
            }))
        }
        < ul className="grid">
          {rows.map(row => {
            return (
              <GridItem
                key={row.id}
                row={row}
                isSelected={this.state.selection.indexOf(row) !== -1}
                onSelectToggle={this.handleSelectToggle}
                contextMenu={
                  <>
                    {
                      commands.map((command, i) => {
                        const props: CommandProps = {
                          renderState: RenderState.contextMenuItem,
                          selection: [row],
                          ClickHandler: (neeDialog: boolean, updated: Row[]) => { this.setState({ processing: [row] }, () => this.runCommand(neeDialog, i, updated)) },
                        }
                        return command.getElement(props);
                      })
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
