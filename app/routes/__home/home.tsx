import { json, redirect, type LoaderArgs } from "@remix-run/node";
import { useCatch } from "@remix-run/react";
import { FAILURE_REDIRECT, getSession } from "~/auth/auth.server";

export async function loader({ request }: LoaderArgs) {
  const { session } = await getSession(request);
  if (!session) return redirect(FAILURE_REDIRECT);

  return json({});
}

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <h1>Logged in</h1>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 403) {
    return (
      <div className="mt-10 text-center">
        <h2 className="mb-4">{caught.data}</h2>
        <button onClick={() => window.location.reload()}>Retry?</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Caught</h1>
      <p>Status: {caught.status}</p>
      <pre>
        <code>{JSON.stringify(caught.data, null, 2)}</code>
      </pre>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <>
      <h1>Oh no!</h1>
      <pre>{error.message}</pre>
      <p>There was an error in the Discover route!</p>
    </>
  );
}
