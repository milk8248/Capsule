require('dotenv').config();

const {
  Pool,
} = require('pg');

const {
  promisify,
} = require('util');
const waitOn = require('wait-on');

let _pool;
const getPGData = {};

// 取得pg環境參數並設定到pg連線參數中
getPGData.pgCredentials = async function pgCredentials() {
  await discoverPGEnvVars();
};

getPGData.pgQuery = async function pgQuery(queryCmd) {
  const pool = getPGData.getPgPool();
  const res = await pool.query(queryCmd);
  return res;
};

getPGData.getPgPool = function getPgPool() {
  if (!_pool) {
    _pool = new Pool();
  }
  return _pool;
};

getPGData.waitPgReady = async function waitPgReady() {
  const {
    PGHOST,
    PGPORT,
  } = process.env;

  console.log(`#waitPgReady ${PGHOST}:${PGPORT}`);
  await waitOn({
    resources: [
      `tcp:${PGHOST}:${PGPORT}`,
    ],
  });
};

async function discoverPGEnvVars() {
  const TAG = '#discoverPGEnvVars';
  const {
    PGHOST,
    PGPORT,
    PGUSER,
    PGDATABASE,
  } = process.env;
  let {
    PGPASSWORD,
  } = process.env;

  console.log(TAG, 'PGHOST', PGHOST);
  console.log(TAG, 'PGPORT', PGPORT);
  console.log(TAG, 'PGUSER', PGUSER);
  console.log(TAG, 'PGDATABASE', PGDATABASE);
  console.log(TAG, 'PGPASSWORD', typeof PGPASSWORD);
}

module.exports = getPGData;
