import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
    protected tableName = "restaurant_choices";

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments("id");

            table.integer("restaurant_id").unsigned().references("restaurants.id");
            table.integer("user_id").unsigned().references("users.id");
            table.integer("day").unsigned().notNullable();

            table.timestamp("created_at", { useTz: true });
            table.timestamp("updated_at", { useTz: true });
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
