import mongoose, { Document, Schema, Model } from "mongoose";

type BalanceDocument = Document & {
  user: Schema.Types.ObjectId;
  balance: Schema.Types.Number;
  deposit: Schema.Types.Number;
  withdrawal: Schema.Types.Number;
};

type BalanceInput = {
  user: BalanceDocument["user"];
  balance: BalanceDocument["balance"];
  deposit: BalanceDocument["deposit"];
  withdrawal: BalanceDocument["withdrawal"];
};

const balanceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Schema.Types.Number,
      required: true,
    },
    deposit: {
      type: Schema.Types.Number,
      required: true,
    },
    withdrawal: {
      type: Schema.Types.Number,
      required: false,
    },
  },
  {
    collection: "balances",
    timestamps: true,
  }
);

const Balance: Model<BalanceDocument> = mongoose.model<BalanceDocument>(
  "Balance",
  balanceSchema
);

export { Balance };
export type { BalanceDocument, BalanceInput };
