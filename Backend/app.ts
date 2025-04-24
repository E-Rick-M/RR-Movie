import express from "express";

import cors from "cors";
import routes from "./routes/routes.ts";
import authRoutes from "./routes/auth.ts";
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use('/auth',authRoutes)

app.use('/movies',routes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);