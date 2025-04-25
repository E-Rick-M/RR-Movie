import express,{type Request,type Response,type NextFunction} from "express";

import cors from "cors";
import routes from "./routes/routes.ts";
import authRoutes from "./routes/auth.ts";
import e from "express";
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use('/auth',authRoutes)

app.use('/movies',routes)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);