import type { HttpContext } from "@adonisjs/core/http";
import { bugConnexionsList } from "./bugConnexionsList.js";
import { destroyBugConnexion } from "./destroyBugConnexion.js";
import { showBugConnexion } from "./showBugConnexion.js";
import { storeBugConnexion } from "./storeBugConnexion.js";
import { updateBugConnexion } from "./updateBugConnexion.js";

export default class BugConnexionsController {
    public async index() {
        return bugConnexionsList();
    }

    public async store(ctx: HttpContext) {
        return storeBugConnexion(ctx);
    }

    public async show(ctx: HttpContext) {
        return showBugConnexion(ctx);
    }

    public async update(ctx: HttpContext) {
        return updateBugConnexion(ctx);
    }

    public async destroy(ctx: HttpContext) {
        return destroyBugConnexion(ctx);
    }
}
