import { SQL } from "bun";
import { pqsConf } from "../config";

const PQSSql = new SQL(
  `postgres://${pqsConf.user}:${pqsConf.pw}@${pqsConf.host}:${pqsConf.port}/${pqsConf.db}`,
);

export { PQSSql };
