/** @type {import('drizzle-kit').Config} */
export default {
  schema: "./utils/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_2teHPyuQ5hWB@ep-orange-silence-a14l1h8g-pooler.ap-southeast-1.aws.neon.tech/prepAi?sslmode=require&channel_binding=require',
  }
};