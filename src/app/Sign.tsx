"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import { useState, useEffect } from "react";

interface User {
  username?: string;
  email: string;
}

interface Session {
  user: User;
}

export default function Home() {
  const { data: session, status } = useSession() as {
    data: Session | null;
    status: string;
  };
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!identifier || !password) {
      setError("Please enter your username/email and password.");
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    });

    if (!result) {
      setError("An error occurred during sign-in. Please try again.");
      return;
    }

    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
      window.location.href = "/";
    }
  };

  useEffect(() => {
    if (status === "unauthenticated" && session?.user) {
   
      signOut({ callbackUrl: "/" });
    }
  }, [status, session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome {session?.user?.username || "Guest"}</h1>
      {session ? (
        <div>
          <p>You are logged in as {session.user.email}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p>Please log in to access your account.</p>
          <button
            onClick={() => signIn("google")}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Log in with Google
          </button>
          <button
            onClick={() => signIn("github")}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Log in with GitHub
          </button>

          <form onSubmit={handleCredentialsLogin} className="mt-4">
            <div>
              <label>
                Username or Email:
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="border px-2 py-1 rounded"
                />
              </label>
            </div>
            <div className="mt-2">
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border px-2 py-1 rounded"
                />
              </label>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            >
              Log in with Credentials
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
