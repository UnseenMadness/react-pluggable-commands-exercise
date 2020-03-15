/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { Row, CommandProps, ICommand } from "../grid/grid";

class IncreaseCommandComponent extends React.Component<CommandProps> {
  componentDidMount() {
    const updated = this.props.processing.map(row => ({
      ...row,
      amount: row.amount + 1
    }));
    window.setTimeout(() => this.props.onCommandComplete(updated), 100);
  }

  render() {
    return null;
  }
}

export const IncreaseCommand: ICommand = {
  toolBarButtonRender: (selection: Row[], runCommand: () => void) => (
    <button
      className="btn"
      title="Increase"
      disabled={
        selection.length === 0 || selection.some(row => row.name === "Const")
      }
      onClick={runCommand}
    >
      <i className="icon icon-plus" />
    </button>
  ),

  contextMenuItemRender: (row: Row, runCommand: () => void) => {
    const disabled = row.name === "Const";
    return (
      <li className={"menu-item" + (disabled ? " disabled" : "")}>
        <a onClick={!disabled ? runCommand : undefined}>Increase</a>
      </li>
    );
  },

  Component: IncreaseCommandComponent
};
