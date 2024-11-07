import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isValidElement, useSyncExternalStore } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const isObject = (item: any) =>
  typeof item === "object" && !Array.isArray(item);

const merge = (target: any, source: any) => {
  const isDeep = (prop: any) =>
    isObject(source[prop]) &&
    target.hasOwnProperty(prop) &&
    isObject(target[prop]) &&
    !isValidElement(source[prop]) &&
    !isValidElement(target[prop]);

  const replaced: any = Object.getOwnPropertyNames(source)
    .map((prop) => ({
      [prop]: isDeep(prop) ? merge(target[prop], source[prop]) : source[prop],
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});

  return {
    ...target,
    ...replaced,
  };
};

export const createState = <T>(state: T) => {
  const listeners = new Set<() => void>();

  const subscribe = (clbk: () => void) => {
    listeners.add(clbk);
    return () => listeners.delete(clbk);
  };
  const localState = localStorage.getItem("state");

  let newState = JSON.parse(localState || JSON.stringify(state)) as T;

  const update = (args: (state: T) => Partial<T>) => {
    newState = merge(newState, args(newState));
    localStorage.setItem("state", JSON.stringify(newState));

    listeners.forEach((l) => l());
    return newState;
  };

  const useListen = <S>(field: (s: T) => S) =>
    useSyncExternalStore(subscribe, () => field(newState));

  return { state: newState, useListen, update };
};

export type StateType = {
  isVerified: boolean;
  tab: "deleted" | "current" | "all" | "complited";
  notes: {
    content: string;
    isDeleted: boolean;
    isComplited: boolean;
    id: number;
  }[];
};

const state: StateType = {
  isVerified: false,
  tab: "all",
  notes: [],
};

export const store = createState(state);

export const storeFunctions = {
  core: (args: Partial<StateType>) => store.update(() => args),
  isValid: (args: { name: string; password: string }) => {
    if (args.password == "admin" && args.password == "admin")
      return store.update(() => ({ isVerified: true }));

    return store.state;
  },
  addTodo: (newTodoText: string) =>
    store.update(({ notes }) => ({
      notes: [
        ...notes,
        {
          content: newTodoText,
          isComplited: false,
          isDeleted: false,
          id: Date.now(),
        },
      ],
    })),

  setOnComplited: (id: number) =>
    store.update((e) => ({
      notes: e.notes.map((item) => {
        if (item.id == id) return { ...item, isComplited: true };
        return item;
      }),
    })),

  setDeleted: (id: number) =>
    store.update((e) => ({
      notes: e.notes.map((item) => {
        if (item.id == id) return { ...item, isDeleted: true };
        return item;
      }),
    })),
};
