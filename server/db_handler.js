const getPGData = require('./getPGData');

getPGData.pgCredentials(); // 取得postgreDBCloud的環境參數

getPGData.waitPgReady();

// Start DB migration
const pool = getPGData.getPgPool();

const db_query = (query, data = []) => {
  return new Promise(function (resolve, reject) {
    pool.query(query, data, (error, results) => {
      if (error) {
        reject({'code': 500, 'massage': 'query failed', response: [error]})
      } else {
        resolve({'code': 200, 'massage': 'query success', response: results.rows})
      }
    })
  })
};

const db_insert = (query, data) => {
  return new Promise(function (resolve, reject) {
    pool.query(query, data, (error, results) => {
      if (error) {
        reject({'code': 500, 'massage': 'insert failed', response: [error]})
      } else {
        resolve({'code': 200, 'massage': 'insert success', response: results.rows})
      }
    })
  })
};

const db_update = (query, data) => {
  return new Promise(function (resolve, reject) {
    pool.query(query, data, (error, results) => {
      if (error) {
        reject({'code': 500, 'massage': 'update failed', response: [error]})
      } else {
        resolve({'code': 200, 'massage': 'update success', response: results.rows})
      }
    })
  })
};

const db_delete = (query, data) => {
  return new Promise(function (resolve, reject) {
    pool.query(query, data, (error, results) => {
      if (error) {
        reject({'code': 500, 'massage': 'delete failed', response: [error]})
      } else {
        resolve({'code': 200, 'massage': 'delete success', response: results.rows})
      }
    })
  })
};

module.exports = {
  db_query,
  db_insert,
  db_update,
  db_delete
};
