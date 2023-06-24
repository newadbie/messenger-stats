import type { ArgumentArray } from "classnames";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ArgumentArray) => {
  return twMerge(classNames(inputs));
};
