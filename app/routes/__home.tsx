import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { FAILURE_REDIRECT, getSession } from "~/auth/auth.server";

export async function loader({ request }: LoaderArgs) {
  const { session } = await getSession(request);
  if (!session) return redirect(FAILURE_REDIRECT);

  return json({});
}

export default function HomeOverview() {
  return (
    <div>
      <h2>Yey I'm logged in!</h2>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <>
      <h1>Oh no!</h1>
      <pre>{error.message}</pre>
      <p>There was an error in the Home route!</p>
    </>
  );
}
