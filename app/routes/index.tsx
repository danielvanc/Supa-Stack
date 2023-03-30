import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { AuthError } from "@supabase/supabase-js";
import {
  createSupabaseClient,
  getSession,
  SUCCESS_REDIRECT,
} from "~/auth/auth.server";
import AuthenticateForm from "~/components/UI/AuthenticateForm";
import Header from "~/components/UI/Header";
import LoginWithEmail from "~/components/UI/LoginWithEmail";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const errors: { email?: string; error?: AuthError | null } = {};

  if (typeof email !== "string" || !email.includes("@")) {
    errors.email = "That doesn't look like an email address";
  }

  if (Object.keys(errors).length) {
    return json(errors, { status: 422 });
  }

  const { supabaseClient, response } = await createSupabaseClient(request);

  const { data } = await supabaseClient.auth.signInWithOtp({
    email: String(email),
    options: {
      emailRedirectTo: `http://${request.headers.get("host")}/oauth/callback/`,
    },
  });

  return json(
    { data },
    {
      headers: response.headers,
    }
  );
};

export async function loader({ request }: LoaderArgs) {
  const { session, error, response } = await getSession(request);
  if (session) return redirect(SUCCESS_REDIRECT, { headers: response.headers });

  return json(
    { error },
    {
      headers: response.headers,
    }
  );
}

export default function Welcome() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto flex h-screen w-full max-w-[75vw] items-center justify-center">
      <div className="w-full">
        <Header />
        <main className="mt-10">
          <h2 className="mb-5 text-lg">Sign in</h2>
          <div className="flex w-full flex-col gap-y-10 md:flex-row md:justify-between md:gap-x-16 md:gap-y-0">
            <LoginWithEmail />
            <AuthenticateForm error={error} />
          </div>
        </main>
      </div>
    </div>
  );
}
