/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { Dialog } from '../dialog/dialog';
import { Row } from '../grid/grid';

export enum RenderState {
    toolbarButton = "toolbarButton",
    contextMenuItem = "contextMenuItem",
    dialog = "dialog"
}

export interface CommandProps {
    renderState: RenderState;
    selection: Row[];
    ClickHandler(needDialog: boolean, updated: Row[]): void;
}

interface CommandState {
    contextMenuVisible: boolean;
    toolbarVisible: boolean;
}

export interface ICommand  {
    toolBarButtonRender(): JSX.Element;
    contextMenuItemRender(): JSX.Element;
    dialogRender(): JSX.Element;
    runCommand(processing: Row[]): Row[];
    getElement(props: CommandProps): JSX.Element;

}

export class IncreaseCommand extends React.Component<CommandProps, CommandState> implements ICommand {
    getElement(props: CommandProps): JSX.Element {
        return <IncreaseCommand
            ClickHandler={props.ClickHandler}
            renderState={props.renderState}
            selection={props.selection} />
    }
    static defaultComponents: CommandProps = {
        renderState: RenderState.toolbarButton,
        selection: [],
        ClickHandler: () => { }
    }

    state: Readonly<CommandState> = {
        toolbarVisible: true,
        contextMenuVisible: true,
    }

    render() {
        const { renderState } = this.props;
        const { contextMenuVisible, toolbarVisible } = this.state;
        if (renderState === RenderState.toolbarButton && toolbarVisible)
            return this.toolBarButtonRender();
        else if (renderState === RenderState.contextMenuItem && contextMenuVisible)
            return this.contextMenuItemRender();
        else
            return null;
    }

    contextMenuItemRender = () => {
        const { selection } = this.props;
        const disabled = selection[0].name === 'Const';
        const handleRowIncrease = disabled
            ? undefined
            : () => this.props.ClickHandler(false, this.runCommand(selection));
        return (<li className={'menu-item' + (disabled ? ' disabled' : '')}>
            <a onClick={handleRowIncrease}>Increase</a>
        </li>);
    }
    dialogRender = () => {
        return <></>;
    }
    runCommand = (processing: Row[]) => {
        var updated = processing.map(row => ({
            ...row,
            amount: row.amount + 1,
        }));
        return updated;
    }
    toolBarButtonRender = () => {
        const { selection } = this.props;
        const disabled = (selection.length === 0 || selection.some(row => row.name === 'Const'));
        return (<button
            className="btn"
            title="Increase"
            disabled={disabled}
            onClick={() => this.props.ClickHandler(false, this.runCommand(selection))}>
            <i className="icon icon-plus" />
        </button>);
    }

}

export class DecreaseCommand extends React.Component<CommandProps, CommandState> implements ICommand {
    getElement(props: CommandProps): JSX.Element {
        return <DecreaseCommand
            ClickHandler={props.ClickHandler}
            renderState={props.renderState}
            selection={props.selection} />
    }

    static defaultComponents: CommandProps = {
        renderState: RenderState.toolbarButton,
        selection: [],
        ClickHandler: () => { }
    }

    state: Readonly<CommandState> = {
        contextMenuVisible: true,
        toolbarVisible: true,
    }

    render() {
        const { renderState } = this.props;
        const { contextMenuVisible, toolbarVisible } = this.state;
        if (renderState === RenderState.toolbarButton && toolbarVisible)
            return this.toolBarButtonRender();
        else if (renderState === RenderState.contextMenuItem && contextMenuVisible)
            return this.contextMenuItemRender();
        else
            return null;
    }


    toolBarButtonRender = () => {
        const { selection } = this.props;
        const disabled = (selection.length === 0 || selection.some(row => row.name === 'Const' || row.amount === 0));
        return (<button
            className="btn"
            title="Decrease"
            disabled={disabled}
            onClick={() => this.props.ClickHandler(false, this.runCommand(selection))}>
            <i className="icon icon-minus" />
        </button>);
    }

    contextMenuItemRender = () => {
        const { selection } = this.props;
        const row = selection[0];
        const disabled = row.name === 'Const' || row.amount === 0;
        const handleRowDecrease = disabled
            ? undefined
            : () => this.props.ClickHandler(false, this.runCommand(selection));
        return (<li className={'menu-item' + (disabled ? ' disabled' : '')}>
            <a onClick={handleRowDecrease}>Decrease</a>
        </li>);
    }

    dialogRender = () => {
        return <></>;
    }

    runCommand = (processing: Row[]) => {
        var updated = processing.map(row => ({
            ...row,
            amount: row.amount - 1,
        }));
        return updated;
    }
}


interface PrintSumCommandState extends CommandState {
    thinking: boolean;
    totalAmount: number;
}

export class PrintSumCommand extends React.Component<CommandProps, PrintSumCommandState> implements ICommand {
    getElement(props: CommandProps): JSX.Element {
        return <PrintSumCommand
            ClickHandler={props.ClickHandler}
            renderState={props.renderState}
            selection={props.selection} />
    }

    static defaultComponents: CommandProps = {
        renderState: RenderState.toolbarButton,
        selection: [],
        ClickHandler: () => { },

    }

    state: Readonly<PrintSumCommandState> = {
        thinking: true,
        totalAmount: 0,
        contextMenuVisible: false,
        toolbarVisible: true,
    }


    render() {
        const { renderState } = this.props;
        const { contextMenuVisible, toolbarVisible } = this.state;

        if (renderState === RenderState.toolbarButton && toolbarVisible)
            return this.toolBarButtonRender();
        else if (renderState === RenderState.contextMenuItem && contextMenuVisible)
            return this.contextMenuItemRender();
        else if (renderState === RenderState.dialog)
            return this.dialogRender();
        else
            return null;
    }


    toolBarButtonRender = () => {
        const { selection } = this.props;
        const disabled = selection.length === 0;
        return (<button
            className="btn"
            title="Print Summary"
            disabled={disabled}
            onClick={() => { this.setState({ thinking: true }, () => this.props.ClickHandler(true, [])); }}>
            <i className="icon icon-emoji" />
        </button>
        );
    }

    contextMenuItemRender = () => {
        return <></>;
    }

    dialogRender = () => {
        const { selection } = this.props;
        const { thinking } = this.state;
        if (thinking) {
            window.setTimeout(() => {
                this.setState({
                    thinking: false,
                    totalAmount: selection.reduce((sum, row) => sum + row.amount, 0)
                });
                this.forceUpdate();
            }, 1000);
            return <Dialog>Calculating total amount...</Dialog>;
        }
        else {
            return <Dialog>
                <div className="modal-header">
                    <div className="modal-title h5">Summary</div>
                </div>
                <div className="modal-body">
                    <div className="content">
                        <p>Total amount for selected items is {this.state.totalAmount} pieces</p>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn" onClick={() => { this.props.ClickHandler(false, this.runCommand(selection)) }}>
                        OK
                  </button>
                </div>
            </Dialog>;
        }
    }

    runCommand = (processing: Row[]) => {
        return processing;
    }
}


export class RenameCommand extends React.Component<CommandProps, CommandState> implements ICommand {
    getElement(props: CommandProps): JSX.Element {
        return <RenameCommand
            ClickHandler={props.ClickHandler}
            renderState={props.renderState}
            selection={props.selection} />
    }

    static defaultComponents: CommandProps = {
        renderState: RenderState.toolbarButton,
        selection: [],
        ClickHandler: () => { },
    }

    name: string = "";


    state: Readonly<CommandState> = {
        contextMenuVisible: true,
        toolbarVisible: true,
    }

    render() {
        const { renderState } = this.props;
        const { contextMenuVisible, toolbarVisible } = this.state;
        if (renderState === RenderState.toolbarButton && toolbarVisible)
            return this.toolBarButtonRender();
        else if (renderState === RenderState.contextMenuItem && contextMenuVisible)
            return this.contextMenuItemRender();
        else if (renderState === RenderState.dialog)
            return this.dialogRender();
        else
            return null;
    }

    toolBarButtonRender(): JSX.Element {
        const { selection } = this.props;
        const disabled = selection.length !== 1;
        return (
            <button
                className="btn"
                title="Rename"
                disabled={disabled}
                onClick={() => { this.props.ClickHandler(true, []) }}
            >
                <i className="icon icon-edit" />
            </button>
        );
    }
    contextMenuItemRender(): JSX.Element {
        return <li className={'menu-item'}>
            <a onClick={() => { this.props.ClickHandler(true, []) }}>Rename</a>
        </li>;
    }


    dialogRender(): JSX.Element {
        const { selection } = this.props;
        return <Dialog>
            <div className="modal-header">
                <div className="modal-title h5">Renaming</div>
            </div>
            <div className="modal-body">
                <div className="content">
                    <p>Name of selected item:</p>
                </div>
                <input defaultValue={selection[0].name} onChange={(e: React.FormEvent<HTMLInputElement>) => { selection[0].newName = e.currentTarget.value }}></input>
            </div>
            <div className="modal-footer">
                <button className="btn" onClick={() => { this.props.ClickHandler(false, this.runCommand(selection)) }}>
                    Rename
          </button>
            </div>
        </Dialog>
    }

    runCommand(processing: Row[]): Row[] {
        const filteredProcessing = processing.filter(row => row.name !== row.newName);
        const rows = filteredProcessing.map(row => ({
            ...row,
            name: row.newName,
        }));
        return rows;
    }
}