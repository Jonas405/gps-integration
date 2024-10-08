import { Router } from "express";

const router = Router();

router.get("/test", (req, res) => {
  res.send("hola\n" + req.params + "\n\n" + req.query);
});

router.post("/test", (req, res) => {
    res.send("hola\n" + req.body);
    });


router.get("/", (req, res) => {
  res.send("hola gps\n" + req.params + "\n\n" + req.query);
});

router.post("/", (req, res) => {
  res.send("hola gps\n" + req.body);
});
export default router;