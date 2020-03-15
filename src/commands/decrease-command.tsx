/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { Row, CommandProps, ICommand } from "../grid/grid";

class DecreaseCommandComponent extends React.Component<CommandProps> {
  componentDidMount() {
    const updated = this.props.processing.map(row => ({
      ...row,
      amount: row.amount - 1
    }));
    window.setTimeout(() => this.props.onCommandComplete(updated), 100);
  }

  render() {
    return null;
  }
}

export const DecreaseCommand: ICommand = {
  toolBarButtonRender: (selection: Row[], runCommand: () => void) => (
    <button
      className="btn"
      title="Decrease"
      disabled={
        selection.length === 0 ||
        selection.some(row => row.name === "Const" || row.amount === 0)
      }
      onClick={runCommand}
    >
      <i className="icon icon-minus" />
    </button>
  ),

  contextMenuItemRender: (row: Row, runCommand: () => void) => {
    const disabled = row.name === "Const" || row.amount === 0;
    return (
      <li className={"menu-item" + (disabled ? " disabled" : "")}>
        <a onClick={!disabled ? runCommand : undefined}>Decrease</a>
      </li>
    );
  },

  Component: DecreaseCommandComponent
};
