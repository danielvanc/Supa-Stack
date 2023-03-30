import * as React from "react";
import { Form } from "@remix-run/react";

export default function Authenticated({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const userData = user || {};

  return (
    <div>
      <main className="lg:col-span-9">{children}</main>
      <Form method="post" action="/logout">
        <button>Logout</button>
      </Form>
    </div>
  );
}
