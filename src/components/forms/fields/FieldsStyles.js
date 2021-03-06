import styled from "styled-components";
import { StyledButton } from "../../StyledComponents/Button";

export const StyledStandardFieldContainer = styled.div`
  display: flex;
  flex-direction: ${({ isCheckbox }) => (isCheckbox ? "row" : "column")};
  margin: 10px 0 20px 0;
  input {
    border: 1px solid black;
  }
  label {
    margin-bottom: 10px;
  }
  input[type="checkbox"] {
    order: -1;
  }
`;

export const StyledFileUploadBtn = styled(StyledButton)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
`;

export const StyledTextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0 20px 0;
  label {
    margin-bottom: 10px;
  }
  textarea {
    resize: none;
    border-radius: 10px;
    padding: 0.3rem 0.6rem;
    border: 1px solid black;
  }
`;

export const StyledSelectFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0 20px 0;
  input {
    border: 1px solid black;
  }
  label {
    margin-bottom: 10px;
  }
`;
