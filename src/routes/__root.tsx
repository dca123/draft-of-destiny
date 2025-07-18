import type { ReactNode } from "react";
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import appCss from "@/styles/app.css?url";
import { getTheme } from "@/lib/theme";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: "Drafts of Destiny",
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
    }),
    component: RootComponent,
    loader: () => getTheme(),
  },
);

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const theme = Route.useLoaderData();
  return (
    <html className={theme}>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <main className="flex-grow p-6 space-y-3">
          <h1 className="font-semibold text-2xl tracking-wide">
            Drafts of Destiny
          </h1>
          {children}
        </main>
        <Toaster position="top-center" />
        <Scripts />
      </body>
    </html>
  );
}
