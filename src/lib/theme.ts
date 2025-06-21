import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
const storageKey = "ui-theme";

export type Theme = "light" | "dark";
export const getTheme = createServerFn().handler(
  () => getCookie(storageKey) || ("dark" as Theme),
);

export const setTheme = createServerFn({ method: "POST" })
  .validator((data: Theme) => data)
  .handler(({ data }) => setCookie(storageKey, data));
