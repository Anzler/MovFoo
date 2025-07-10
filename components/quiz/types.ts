// ~/Projects/movfoo/components/quiz/types.ts

export type Option = {
  value: string;
  label: string;
};

export type Question = {
  id: string;
  label: string;
  type: "single" | "multi" | "range";
  apiField: string;
  options?: Option[];
  rangeConfig?: {
    min: number;
    max: number;
    step: number;
  };
};

