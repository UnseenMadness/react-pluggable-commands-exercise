import * as React from "react";
import { Row, CommandProps, ICommand } from "../grid/grid";
import { Dialog } from "../dialog/dialog";

interface State {
  thinking: boolean;
  totalAmount: number;
}

class PrintSumCommandComponent extends React.Component<
  CommandProps,
  State
> {
  state: Readonly<State> = {
    thinking: true,
    totalAmount: NaN
  };

  componentDidMount() {
    window.setTimeout(
      () =>
        this.setState({
          thinking: false,
          totalAmount: this.props.processing.reduce(
            (sum, row) => sum + row.amount,
            0
          )
        }),
      1000
    );
  }

  render() {
    const { thinking, totalAmount } = this.state;

    return thinking ? (
      <Dialog>Calculating total amount...</Dialog>
    ) : (
      <Dialog>
        <div className="modal-header">
          <div className="modal-title h5">Summary</div>
        </div>
        <div className="modal-body">
          <div className="content">
            <p>Total amount for selected items is {totalAmount} pieces</p>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn"
            onClick={() => this.props.onCommandComplete([])}
          >
            OK
          </button>
        </div>
      </Dialog>
    );
  }
}

export const PrintSumCommand: ICommand = {
  toolBarButtonRender: (selection: Row[], runCommand: () => void) => (
    <button
      className="btn"
      title="Summary"
      disabled={selection.length === 0}
      onClick={runCommand}
    >
      <i className="icon icon-emoji" />
    </button>
  ),

  contextMenuItemRender: (row: Row, runCommand: () => void) => null,

  Component: PrintSumCommandComponent
};
