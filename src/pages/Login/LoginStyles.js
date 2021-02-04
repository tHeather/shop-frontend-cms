import styled from "styled-components";

export const StyledLoginPageForm = styled.form`
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  label {
    margin-bottom: 10px;
  }
  input {
    margin-bottom: 30px;
  }
  button {
    margin-top: 10px;
  }
  button,
  input,
  label {
    width: 300px;
  }
`;
