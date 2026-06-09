require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

// Import Routes
const stockRoutes = require("./src/routes/stock.routes");
const menuRoutes = require("./src/routes/menu.routes");
const bahanBakuRoutes = require("./src/routes/bahan.routes");
const komposisiRoutes = require("./src/routes/komposisi.routes");
const pesananRoutes = require("./src/routes/order.routes");
const detailPesananRoutes = require("./src/routes/detailPesanan.routes");
const authRoutes = require("./src/routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Register Routes
app.use("/api/stocks", stockRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/bahan-baku", bahanBakuRoutes);
app.use("/api/komposisi", komposisiRoutes);
app.use("/api/pesanan", pesananRoutes);
app.use("/api/detail-pesanan", detailPesananRoutes);
app.use("/api/auth", authRoutes);

// Swagger Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({
    message: "SIMPOK API Running",
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
