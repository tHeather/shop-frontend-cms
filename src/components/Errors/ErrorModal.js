import React from "react";

export default function ErrorModal({ errorsArray, clearErrors }) {
  return (
    <div>
      <button data-testid="closeErrorBtn" onClick={() => clearErrors([])}>
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
