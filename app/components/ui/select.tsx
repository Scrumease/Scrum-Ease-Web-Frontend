import Select, { components } from "react-select";

export const CustomOption = (props: any) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <div className="flex justify-between items-center">
        <span>{data.label}</span>
        <button
          type="button"
          className="ml-2 btn btn-xs btn-info"
          onClick={(e) => {
            e.stopPropagation();
            data.onDetailsClick();
          }}
        >
          Detalhes
        </button>
      </div>
    </components.Option>
  );
};
