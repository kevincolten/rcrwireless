const yosql = require('yosql');
const sqlite3 = require('sqlite3');
const forms = require('./forms');

yosql.createTable('forms', forms, (err, schema) => {
  if (err) return console.log(err);
  const db = new sqlite3.Database('database.sqlite3');
  Object.keys(schema).forEach(table => {
    db.serialize(() => {
      db.run(schema[table].queries[0]); // Create statement;
      db.run(schema[table].queries[1]); // Insert statement;      
    });
  });
  db.close();
});
