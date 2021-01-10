import styled from "styled-components";

export const StyledLoginPageForm = styled.form`
  align-self: center;
  margin: auto;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme: { secondaryColor } }) => secondaryColor};
  border-radius: 10px;
  padding: 1.5rem 1.5rem;
  max-width: 300px;
  width: 100%;
  label {
    margin-bottom: 10px;
  }
  input {
    margin-bottom: 20px;
  }
`;
