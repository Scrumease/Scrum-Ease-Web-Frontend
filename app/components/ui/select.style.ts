export const selectStyle = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)))",
    borderColor: "var(--fallback-bc,oklch(var(--bc)/0.2))",
    boxShadow: state.isFocused ? "0 0 0 2px var(--tw-ring-color)" : "none",
    "&:hover": {
      borderColor: "var(--tw-border-color)",
    },
    padding: "0.25rem 0.5rem",
    borderRadius: "var(--rounded-btn)",
    minHeight: "2.5rem",
    color: "inherit",
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "var(--rounded-btn)",
    boxShadow: "var(--tw-shadow-lg)",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)))",
    color: "inherit",
    "&:hover": {
      backgroundColor: "var(--fallback-bc,oklch(var(--bc)/0.1))",
      color: "var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)))",
    },
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "var(--tw-bg-color)",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "var(--tw-text-base)",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "var(--tw-text-base)",
    "&:hover": {
      backgroundColor: "var(--tw-bg-hover)",
      color: "var(--tw-text-color-hover)",
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "var(--tw-text-base)",
  }),
};
