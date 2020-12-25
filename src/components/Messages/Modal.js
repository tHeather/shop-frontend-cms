import React from "react";

export function Modal({ children }) {
  return <div>{children}</div>;
}

export const InfoModal = ({ closeHandler, btnText, children }) => {
  return (
    <Modal>
      {children}
      <button onClick={closeHandler}>{btnText}</button>
    </Modal>
  );
};
