import { useField } from "formik";
import { StyledErrorMessage } from "../../Errors/ErrorStyles";
import { StyledInput } from "../../StyledComponents/Input";
import {
  StyledStandardFieldContainer,
  StyledFileUploadBtn,
  StyledTextAreaContainer,
  StyledSelectFieldContainer,
} from "./FieldsStyles";

export const StandardField = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  const id = props.id ? props.id : props.name;
  return (
    <StyledStandardFieldContainer isCheckbox={props.type === "checkbox"}>
      <label htmlFor={id}>{label}</label>
      <StyledInput id={id} {...field} {...props} />
      {meta.touched && meta.error && (
        <StyledErrorMessage>{meta.error}</StyledErrorMessage>
      )}
    </StyledStandardFieldContainer>
  );
};

export const TextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  const id = props.id ? props.id : props.name;
  return (
    <StyledTextAreaContainer>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} {...field} {...props}></textarea>
      {meta.touched && meta.error && (
        <StyledErrorMessage>{meta.error}</StyledErrorMessage>
      )}
    </StyledTextAreaContainer>
  );
};

export function FileUploadField({ label, ...props }) {
  const [{ value }, meta, { setValue, setTouched }] = useField(props.name);
  const id = props.id ? props.id : props.name;
  const computedLabel = value && value.name ? value.name : "Choose file";
  const handleInputChange = (e) => {
    setValue(e.target.files[0]);
    setTouched(true, false);
  };

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        {...props}
        id={id}
        type="file"
        onChange={handleInputChange}
        style={{ display: "none" }}
      />
      <StyledFileUploadBtn as="label" htmlFor={id}>
        {computedLabel}
      </StyledFileUploadBtn>
      {meta.touched && meta.error && (
        <StyledErrorMessage>{meta.error}</StyledErrorMessage>
      )}
    </>
  );
}

export const SelectField = ({ label, children, ...props }) => {
  const [field, meta] = useField(props.name);
  const id = props.id ? props.id : props.name;
  return (
    <StyledSelectFieldContainer>
      <label htmlFor={id}>{label}</label>
      <StyledInput as="select" id={id} {...field} {...props}>
        {children}
      </StyledInput>
      {meta.touched && meta.error && (
        <StyledErrorMessage>{meta.error}</StyledErrorMessage>
      )}
    </StyledSelectFieldContainer>
  );
};
