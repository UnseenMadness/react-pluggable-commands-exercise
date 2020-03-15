/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { Row, CommandProps, ICommand } from "../grid/grid";
import { Dialog } from "../dialog/dialog";

interface State {
  newName: string;
}

class RenameCommandComponent extends React.Component<
  CommandProps,
  State
> {
  state: Readonly<State> = {
    newName: '',
  };

  componentDidMount() {
    const row = this.props.processing[0];
    this.setState({ newName: row.name });
  }

  render() {
    const { newName } = this.state;
    const row = this.props.processing[0];

    return (
      <Dialog>
      <div className="modal-header">
        <div className="modal-title h5">Renaming</div>
      </div>
      <div className="modal-body">
        <div className="content">
          <p>Name of selected item:</p>
        </div>
        <input defaultValue={row.name} onChange={(e: React.FormEvent<HTMLInputElement>) => this.setState({ newName: e.currentTarget.value })} />
      </div>
      <div className="modal-footer">
        <button className="btn" disabled={newName === row.name} onClick={() => { this.props.onCommandComplete([{...row, name: newName}]) }}>
          Rename
        </button>
        <button className="btn" onClick={() => { this.props.onCommandComplete([]) }}>
          Cancel
        </button>
      </div>
  </Dialog>
);
  }
}

export const RenameCommand: ICommand = {
  toolBarButtonRender: (selection: Row[], runCommand: () => void) => (
    <button
      className="btn"
      title="Rename"
      disabled={selection.length !== 1}
      onClick={runCommand}
    >
      <i className="icon icon-edit" />
    </button>
  ),

  contextMenuItemRender: (row: Row, runCommand: () => void) => {
    return (
      <li className="menu-item">
        <a onClick={runCommand}>Rename</a>
      </li>
    );
  },

  Component: RenameCommandComponent
};
