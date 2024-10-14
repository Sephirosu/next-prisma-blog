"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function SignIn() {
  const { data: session } = useSession();

  const handleSignInWithGoogle = async () => {
    await signIn("google", { redirect: false });
  };

  const handleSignInWithGithub = async () => {
    await signIn("github", { redirect: false });
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div>
      {session ? (
        <div>
          <p>Welcome, {session.user?.name}!</p>
          <button onClick={handleSignOut}>Sign out</button>{" "}
        </div>
      ) : (
        <div>
          <button onClick={handleSignInWithGoogle}>Sign in with Google</button>{" "}
          <button onClick={handleSignInWithGithub}>Sign in with GitHub</button>{" "}
        </div>
      )}
    </div>
  );
}
