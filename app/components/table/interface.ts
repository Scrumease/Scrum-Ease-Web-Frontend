export interface Column<T> {
  header: string;
  accessor: NestedKeyOf<T>;
  Cell?: (value: any) => JSX.Element;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ActionButton<T> {
  label: string | ((rowData: T) => string);
  onClick: (rowData: T) => void;
  icon?: JSX.Element;
  show: (rowData: T) => boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  pagination?: Pagination;
  filters?: JSX.Element;
  actionButtons?: ActionButton<T>[];
}

type NestedKeyOf<T> = {
  [K in keyof T]: T[K] extends object
    ? `${K & string}.${NestedKeyOf<T[K]>}`
    : K & string;
}[keyof T];
