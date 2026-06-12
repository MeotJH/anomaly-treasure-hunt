"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type InteractionLockState = {
  isLocked: boolean;
  message: string | null;
};

type InteractionLockContextValue = InteractionLockState & {
  lock: (message: string) => void;
  unlock: () => void;
};

const InteractionLockContext = createContext<InteractionLockContextValue | null>(null);

export function InteractionLockProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<InteractionLockState>({
    isLocked: false,
    message: null,
  });

  const lock = useCallback((message: string) => {
    setState({
      isLocked: true,
      message,
    });
  }, []);

  const unlock = useCallback(() => {
    setState({
      isLocked: false,
      message: null,
    });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      lock,
      unlock,
    }),
    [lock, state, unlock],
  );

  return (
    <InteractionLockContext.Provider value={value}>
      {children}
    </InteractionLockContext.Provider>
  );
}

export function useInteractionLock() {
  const context = useContext(InteractionLockContext);

  if (!context) {
    throw new Error("useInteractionLock must be used within InteractionLockProvider.");
  }

  return context;
}
