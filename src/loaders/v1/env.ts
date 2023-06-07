class Env {
  static names = ["PORT", "DATABASE_URL", "MONGO_URL"] as const;
  static variable: Record<(typeof Env.names)[number], string>;
  static Loader() {
    const values: Record<string, string> = {};
    for (const key of Env.names) {
      const value = process.env[key];
      if (value) {
        values[key] = value;
      } else {
        console.error(`Environment variable ${key} is not defined.`);
        process.exit(1);
      }
    }
    Env.variable = values;
  }
}

export default Env;
