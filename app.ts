import Express from "express";
import morgan from "morgan";
import router from "./src/routes";

export class App {
    app: Express.Application;

    constructor() {
        this.app = Express();
        this.middlewares();
        this.listen(4000);
    }

    middlewares() {
        this.app.use(Express.json());
        this.app.use(morgan("dev"));
        this.app.use(router)
    }

    listen(port: number | string) {
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
}