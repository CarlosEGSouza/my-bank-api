import express from "express";
import accountController from "../controllers/accountController.js";

const app = express();

app.put("/deposit/:agencia/:conta/:value", accountController.deposit);
app.put("/withdraw/:agencia/:conta/:value", accountController.withdraw);
app.put(
  "/transfer/:sourceAccount/:destinationAccount/:value",
  accountController.transfer
);
app.get("/checkbalance/:agencia/:conta", accountController.checkbalance);
app.delete("/removeAccount/:agencia/:conta", accountController.removeAccount);
app.get("/balanceaverage/:agencia", accountController.balanceaverage);
app.get("/lowestaccountbalance/:count", accountController.lowestAccountBalance);
app.get(
  "/highestaccountbalance/:count",
  accountController.highestAccountBalance
);
app.put(
  "/transferhighestaccountbalanceclient",
  accountController.transferHighestAccountBalanceClient
);

export { app as accountRouter };
