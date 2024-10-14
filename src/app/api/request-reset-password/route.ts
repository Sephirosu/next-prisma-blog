import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { randomBytes } from "crypto";
import { sendResetPasswordEmail } from "@lib/mailgun";

const generateToken = () => randomBytes(32).toString("hex");

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    console.log("Error: Email is required.");
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log("Error: User not found for email:", email);
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const token = generateToken();
  const expiry = new Date(Date.now() + 3600000);

  console.log("Storing token:", token, "with expiry:", expiry);

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });

  try {
    await sendResetPasswordEmail(email, token);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return NextResponse.json(
      { error: "Failed to send reset password email." },
      { status: 500 }
    );
  }

  console.log("Password reset email sent to:", email);
  return NextResponse.json(
    { message: "Password reset email sent." },
    { status: 200 }
  );
}
