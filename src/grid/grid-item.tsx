/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

type Props = {
  row: any;
  isSelected: boolean;
  contextMenu: React.ReactNode;
  onSelectToggle: (row: any) => void;
};

const GridItem: React.FC<Props> = (props: Props) => {
  const { row, isSelected, contextMenu, onSelectToggle } = props;
  return (
    <div key={row.id} className="tile tile-centered">
      <div className="tile-icon">
        <button className="btn btn-sm" onClick={() => onSelectToggle(row)}>
          <i className={'icon centered icon-check' + (isSelected ? '' : ' d-invisible')}></i>
        </button>
      </div>
      <div className="tile-content">
        <div className="tile-title">{row.name}</div>
        <small className="tile-subtitle">
          {row.amount}&nbsp;<span className="text-gray">pieces</span>
        </small>
      </div>
      <div className="tile-action dropdown dropdown-right">
        <a href="#" className="btn btn-link dropdown-toggle" tabIndex={0}>
          <i className="icon icon-more-vert"></i>
        </a>
        <ul className="menu">{contextMenu}</ul>
      </div>
    </div>
  );
};

export default GridItem;
