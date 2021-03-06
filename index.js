import express from "express";
import { accountRouter } from "./routes/accountRouter.js";
import { db } from "./models/db.js";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  try {
    await db.mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.log("Conectado com o mongodb com sucesso");
  } catch (error) {
    console.log("Erro ao conectar no mongodb " + error);
  }
})();

const app = express();

app.use(express.json());
app.use(accountRouter);

app.listen(process.env.API_PORT, () => {
  console.log("Api Started...");
});
