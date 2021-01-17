import React from "react";

export default function ErrorModal({ errorsArray, closeHandler }) {
  return (
    <div>
      <button data-testid="closeErrorBtn" onClick={closeHandler}>
        &#10006;
      </button>
      <ul>
        {errorsArray.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
