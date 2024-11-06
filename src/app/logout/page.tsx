import { signOut } from "next-auth/react";

export default function Logout() {
  return (
    <div className="logout-container">
      <h1>Are you sure you want to log out?</h1>
      <button onClick={() => signOut({ callbackUrl: "/" })}>Log out</button>
    </div>
  );
}
