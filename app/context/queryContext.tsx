"use client";
import React from 'react';
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";

const queryclient =new QueryClient();

const queryContext = ({ children}: { children: React.ReactNode}) => {
  return (
    <QueryClientProvider client={queryclient}>
      {children}
    </QueryClientProvider>
  );
}

export default queryContext;
