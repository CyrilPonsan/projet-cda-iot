import CustomError from "../../../utils/types/custom-error";

interface FieldNumberProps {
  label?: string;
  placeholder?: string;
  name: string;
  min: number;
  max?: number;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: Record<string, string>;
    onChangeValue: (fieldNumber: string, value: string) => void;
    errors: CustomError[];
  };
}

const FieldNumber = (props: FieldNumberProps) => {
  const { label, placeholder, name, min, max } = props;

  const baseStyle = "w-full input input-bordered focus:outline-none";

  const style = props.data.errors.find((item) => item.type === name)
    ? baseStyle + " input-error"
    : baseStyle;

  //console.log(name + " :", props.data.values[name]);

  return (
    <div className="w-full flex flex-col gap-y-2">
      <label htmlFor={name}>{label}</label>
      <input
        className={style}
        type="number"
        id={name}
        name={name}
        min={min}
        max={max}
        value={
          props.data.values[name] !== undefined ? props.data.values[name] : ""
        }
        placeholder={placeholder}
        onChange={(event) =>
          props.data.onChangeValue(name, event.currentTarget.value)
        }
      />
    </div>
  );
};

export default FieldNumber;
