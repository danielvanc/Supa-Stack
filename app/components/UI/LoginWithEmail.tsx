import { Form, useActionData, useNavigation } from "@remix-run/react";
import { TextField } from "./Fields";

export default function LoginWithEmail() {
  const data = useActionData();
  const errors = useActionData();
  const transition = useNavigation();
  const isSubmitting = transition.state === "submitting";

  return (
    <Form method="post" className="w-full">
      {!errors?.email && data ? (
        <p>Success! Go ahead and click the link in your email!</p>
      ) : (
        <>
          <TextField
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`${
              data?.errors?.email ? "border-red-300 text-red-900" : ""
            }`}
          />
          {data?.errors?.email && <p>Please submit a valid email address</p>}
          <div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Requesting a login link..." : null}
              {!isSubmitting ? (
                <span>
                  Request a login link <span aria-hidden="true">&rarr;</span>
                </span>
              ) : null}
            </button>
          </div>
        </>
      )}
    </Form>
  );
}
