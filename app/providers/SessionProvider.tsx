"use client";


import { SessionProvider } from "next-auth/react";

export function SessionProviderWrap({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
