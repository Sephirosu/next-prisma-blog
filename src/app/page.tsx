import { signIn, signOut, auth } from "@/auth";

export default async function SignIn() {
  const session = await auth();
  console.log(session);
  const user = session?.user;

  return (
    <div>
      {!user ? (
        <>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/secret" });
            }}
          >
            <button type="submit">Sign in with Google</button>
          </form>
          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <button type="submit">Sign in with GitHub</button>
          </form>
        </>
      ) : (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit">Sign Out</button>
          </form>
        </div>
      )}
    </div>
  );
}
