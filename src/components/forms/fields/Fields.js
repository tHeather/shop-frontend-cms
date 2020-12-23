import { useField } from "formik";

export const StandardField = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  const id = props.id ? props.id : props.name;
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...field} {...props} />
      {meta.touched && meta.error ? <div>{meta.error}</div> : null}
    </>
  );
};

export const TextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  const id = props.id ? props.id : props.name;
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} {...field} {...props}></textarea>
      {meta.touched && meta.error ? <div>{meta.error}</div> : null}
    </>
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
    <div>
      <label htmlFor={id}>{label}</label>
      <input {...props} id={id} type="file" onChange={handleInputChange} />
      <label htmlFor={id}>{computedLabel}</label>
      {meta.touched && meta.error ? <div>{meta.error}</div> : null}
    </div>
  );
}
