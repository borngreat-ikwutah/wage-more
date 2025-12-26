import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { verifyMessage } from "viem";
import { db } from "~/db/client";
import { user } from "~/db/schema";
import { auth } from "~/lib/auth";

type OnboardingVerifyType = {
  username: string;
  interests: string[];
  walletAddress: string;
  signature: string; // Proof they own the wallet
};

export const completeOnboardingFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: OnboardingVerifyType) => data)
  .handler(async ({ data }) => {
    const requestHeaders = getRequest().headers;

    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session) throw new Error("Unauthorized");

    const isValid = await verifyMessage({
      address: data.walletAddress as `0x${string}`,
      message: `Link wallet ${data.walletAddress} to account ${session.user.id}`,
      signature: data.signature as `0x${string}`,
    });

    if (!isValid) throw new Error("Invalid wallet signature");

    // 2. Check if wallet is already taken by another user
    const existingWallet = await db.query.user.findFirst({
      where: eq(user.walletAddress, data.walletAddress),
    });

    if (existingWallet && existingWallet.id !== session.user.id) {
      throw new Error("Wallet already linked to another account");
    }

    // 3. Update User Profile
    await db
      .update(user)
      .set({
        name: data.username,
        interests: data.interests,
        walletAddress: data.walletAddress,
        onboardingCompleted: true,
      })
      .where(eq(user.id, session.user.id));

    return { success: true };
  });
