import { Migration } from '@mikro-orm/migrations';

export class Migration20250322202132 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" serial primary key, "username" varchar(255) not null, "password" varchar(255) not null, "email" varchar(255) null, "roles" jsonb not null, "surname" varchar(255) null, "lastname" varchar(255) null);`,
    );
    this.addSql(`alter table "user" add constraint "user_username_unique" unique ("username");`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
    this.addSql(`
      INSERT INTO "user" ("username", "password", "email", "roles")
      VALUES ('admin', '$2a$12$Ao8PRvOdu6a.gAqLNQCjXepRL3lqSPHSy9m3.85vZxGdmT4sDVkKe', 'admin@example.com', '["ADMIN"]');
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }
}
