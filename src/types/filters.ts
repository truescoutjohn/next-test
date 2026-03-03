import { UNIT_OPTIONS } from "../constants/select-options";
import { CATEGORY_OPTIONS } from "../constants/select-options";

export interface IFilters {
  searchQuery: string;
  dateFrom: string;
  dateTo: string;
  unit: typeof CATEGORY_OPTIONS;
  category: typeof UNIT_OPTIONS;
}
