import { useRouter } from "@tanstack/react-router";
import { atom } from "jotai";
import { createContext, type PropsWithChildren } from "react";

const themeAtom = atom<Theme | null>(null);
