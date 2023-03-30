import type { Mock } from "vitest";
import { render } from "tests/utils";
import { loader } from "~/routes/index";
import LoginWithEmail from "~/components/UI/LoginWithEmail";
import { getSession } from "~/auth/auth.server";
import { createCookieSessionStorage } from "@remix-run/node";

vi.mock("~/auth/client", () => {
  return {
    signInWithProvider: vi.fn(),
  };
});

vi.mock("~/auth/auth.server", () => {
  return {
    oAuthStrategy: {
      checkSession: vi.fn(),
    },
    getSession: vi.fn(),
    SUCCESS_REDIRECT: "/",
  };
});

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "Nice cookie",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [`${process.env.SESSION_SECRET}`],
    secure: process.env.NODE_ENV === "production",
  },
});

test("renders loginWithEmail form with required fields", async () => {
  const { getByRole } = render("/", <LoginWithEmail />);

  const emailInput = getByRole("textbox", { name: /email address/i });
  const submitButton = getByRole("button", { name: /request a login link/i });
  expect(emailInput).toBeInTheDocument();
  expect(emailInput).toHaveAttribute("type", "email");
  expect(submitButton).toBeInTheDocument();
  expect(submitButton).toHaveTextContent(/request a login link/i);
});

test("should return a response", async () => {
  let session = await sessionStorage.getSession();
  (getSession as Mock).mockReturnValueOnce({
    session,
    error: null,
    response: {
      headers: {
        cookie: await sessionStorage.commitSession(session),
      },
    },
  });

  const response = await loader({
    request: new Request("http://localhost:3000"),
    params: {},
    context: {},
  });

  expect(response).toBeInstanceOf(Response);
});
