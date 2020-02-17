/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';

export const Dialog: React.FC = (props: { children?: React.ReactNode }) => {
  return (
    <div className="modal modal-sm active">
      <a href="#close" className="modal-overlay" aria-label="Close"></a>
      <div className="modal-container">{props.children}</div>
    </div>
  );
};
