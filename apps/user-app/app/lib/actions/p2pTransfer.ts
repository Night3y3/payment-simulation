"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  try {
    const session = await getServerSession(authOptions);
    const from: string = session?.user?.id;
    if (!from) {
      return {
        message: "Error while sending",
      };
    }

    const toUser = await prisma.user.findFirst({
      where: {
        number: to,
      },
    });
    if (!toUser) {
      return {
        message: "User not found",
      };
    }

    console.log(toUser.name);
    console.log(session?.user?.name);

    await prisma.$transaction(async (tx) => {
      // Locking the row for the user's balance while a transaction is in progress
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
      const fromBalance = await tx.balance.findUnique({
        where: { userId: Number(from) },
      });

      console.log("1");

      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error("Insufficient funds");
      }

      await tx.balance.update({
        where: { userId: Number(from) },
        data: { amount: { decrement: amount } },
      });

      console.log("2");

      await tx.balance.update({
        where: { userId: toUser.id },
        data: { amount: { increment: amount } },
      });

      console.log("3");

      try {
        await tx.p2pTransfer.create({
          data: {
            fromUserId: Number(from),
            toUserId: toUser.id,
            amount,
            timestamp: new Date(),
          },
        });
        console.log("4");
      } catch (error) {
        console.error("Error creating p2pTransfer:", error);
      }

      return { message: "Transfer successful" };
    });
  } catch (error) {
    console.error("Error while transferring:", error);
    return { message: "Error while transferring" };
  }
}
