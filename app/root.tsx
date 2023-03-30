import { json, type MetaFunction, type LoaderArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import tailwindStyles from "~/tailwind.css";
import { getMetaInfo } from "~/utils/seo";
import { getSession } from "./auth/auth.server";
import { useWatchSession } from "./auth/client";
import LoggedIn from "./components/LoggedIn";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
  ...getMetaInfo({ title: "Add your title" }),
});

export function links() {
  return [{ rel: "stylesheet", href: tailwindStyles }];
}

export const loader = async ({ request }: LoaderArgs) => {
  const { SUPABASE_URL, SUPABASE_KEY } = process.env;
  const { session, error, response } = await getSession(request);

  return json({
    session: session,
    error,
    env: {
      SUPABASE_URL,
      SUPABASE_KEY,
    },
    headers: response.headers,
  });
};

export default function App() {
  const { env, session } = useLoaderData<typeof loader>();
  const context = useWatchSession(session);
  const isLoggedIn = session?.user;

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {isLoggedIn ? (
          <LoggedIn user={context.session?.user || {}}>
            <Outlet context={context} />
          </LoggedIn>
        ) : (
          <Outlet context={context} />
        )}

        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <html lang="en" className="dark">
        <head>
          <title>You 404'd</title>
          <Links />
        </head>
        <body className="bg-gray">
          {/* TODO: Add a custom 404 component */}
          <p>You came to the wrong place, dude!</p>
          <Scripts />
        </body>
      </html>
    );
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

// TODO: Add a better U.I component for main Error Boundary
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <>
      <h1>Boom!</h1>
      <pre>{error.message}</pre>
      <p>Houston we have a problem with the mainframe</p>
    </>
  );
}
