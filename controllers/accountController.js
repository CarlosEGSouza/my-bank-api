import { db } from "../models/db.js";

const Account = db.account;

const deposit = async (req, res) => {
  try {
    const { agencia, conta, value } = req.params;
    let data = await Account.findOne({ agencia: agencia, conta: conta });
    if (data) {
      data.balance = data.balance + parseFloat(value);
      const newData = await Account.findByIdAndUpdate({ _id: data._id }, data, {
        new: true,
      });
      res.send(newData);
    } else {
      res.send({ informationMessage: "Conta não localizada" });
    }
  } catch (error) {
    res.sendStatus(500).send({ errorMessage: error });
  }
};

const withdraw = async (req, res) => {
  const { agencia, conta, value } = req.params;
  try {
    let data = await Account.findOne({ agencia: agencia, conta: conta });
    if (data) {
      data.balance = data.balance - parseFloat(value) - 1;
      if (data.balance > 0) {
        const newData = await Account.findByIdAndUpdate(
          { _id: data._id },
          data,
          { new: true }
        );
        res.send(newData);
      } else {
        res.send({ informationMessage: "Saldo insuficiente" });
      }
    } else {
      res.send({ informationMessage: "Conta não localizada" });
    }
  } catch (error) {
    res.sendStatus(500).send({ errorMessage: error });
  }
};

const checkbalance = async (req, res) => {
  const { agencia, conta } = req.params;
  try {
    const data = await Account.find(
      { agencia: agencia, conta: conta },
      { balance: 1 }
    );
    if (data) {
      res.send(data);
    } else {
      res.send({ informationMessage: "Conta não localizada" });
    }
  } catch (error) {
    res.sendStatus(500).send({ errorMessage: error });
  }
};

const removeAccount = async (req, res) => {
  const { agencia, conta } = req.params;
  try {
    const data = await Account.findOne({ agencia: agencia, conta: conta });
    if (data) {
      await Account.deleteOne({ _id: data._id });
      const countContas = await Account.countDocuments({ agencia: agencia });
      res.send({ contasAtivas: countContas });
    } else {
      res.send({ informationMessage: "Conta não localizada" });
    }
  } catch (error) {
    res.sendStatus(500).send({ errorMessage: error });
  }
};

const transfer = async (req, res) => {
  const { sourceAccount, destinationAccount, value } = req.params;
  try {
    let dataSourceAccount = await Account.findOne({ conta: sourceAccount });
    let dataDestinationAccount = await Account.findOne({
      conta: destinationAccount,
    });
    if (dataSourceAccount && dataDestinationAccount) {
      dataSourceAccount.balance = dataSourceAccount.balance - parseFloat(value);
      dataDestinationAccount.balance =
        dataDestinationAccount.balance + parseFloat(value);
      if (dataSourceAccount.agencia !== dataDestinationAccount.agencia) {
        dataSourceAccount.balance = dataSourceAccount.balance - 8;
      }
      await Account.findByIdAndUpdate(
        { _id: dataSourceAccount._id },
        dataSourceAccount,
        { new: true }
      );
      await Account.findByIdAndUpdate(
        { _id: dataDestinationAccount._id },
        dataDestinationAccount,
        { new: true }
      );
      res.send({ sourceAccountBalance: dataSourceAccount.balance });
    } else {
      res.send({ informationMessage: "Conta não localizada" });
    }
  } catch (error) {
    res.sendStatus(500).send({ errorMessage: error });
  }
};

const balanceaverage = async (req, res) => {
  const { agencia } = req.params;
  try {
    const data = await Account.aggregate([
      {
        $match: { agencia: parseInt(agencia) },
      },
      {
        $group: {
          _id: "$agencia",
          media: {
            $avg: "$balance",
          },
        },
      },
    ]);
    res.send(data);
  } catch (error) {
    res.sendStatus(500).send({ errorMessage: error });
  }
};

const lowestAccountBalance = async (req, res) => {
  const { count } = req.params;
  try {
    const data = await Account.find({})
      .sort({ balance: 1 })
      .limit(parseInt(count));
    res.send(data);
  } catch (error) {
    res.sendStatus(500).send({ errorMessage: error });
  }
};

const highestAccountBalance = async (req, res) => {
  const { count } = req.params;
  try {
    const data = await Account.find({})
      .sort({ balance: -1 })
      .limit(parseInt(count));
    res.send(data);
  } catch (error) {
    res.sendStatus(500).send({ errorMessage: error });
  }
};

const transferHighestAccountBalanceClient = async (req, res) => {
  try {
    const clientsToTransfer = await Account.aggregate([
      {
        $group: {
          _id: "$agencia",
          balance: { $max: "$balance" },
        },
      },
    ]);

    for (const client of clientsToTransfer) {
      const { _id, balance } = client;
      let clientToTransfer = await Account.findOne({
        agencia: _id,
        balance: balance,
      });
      clientToTransfer.agencia = 99;
      await clientToTransfer.save();
    }
    const clientCount = await Account.find({ agencia: 99 });
    res.send(clientCount);
  } catch (error) {
    res.sendStatus(500).send({ errorMessage: error });
  }
};

export default {
  deposit,
  withdraw,
  checkbalance,
  removeAccount,
  transfer,
  balanceaverage,
  lowestAccountBalance,
  highestAccountBalance,
  transferHighestAccountBalanceClient,
};
