import { dieaseData } from "./data";
import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createFuzzyMatcher } from "./utils";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.get("/", async (req: Request, res: Response): Promise<Response> => {
  try {
    const { searchText } = req.query;

    if (!searchText) {
      return res.json({
        ok: false,
        error: "검색어를 입력해주세요.",
      });
    }

    const result = dieaseData
      .filter((i) => createFuzzyMatcher(searchText as string).test(i.sickNm))
      .slice(0, 10);

    return res.json({
      ok: true,
      result,
    });
  } catch (error) {
    return res.json({
      ok: false,
      error,
    });
  }
});

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
