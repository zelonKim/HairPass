import { TODAY } from "./TODAY";

export const TODAY_STR = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, "0")}-${String(TODAY.getDate()).padStart(2, "0")}`;
