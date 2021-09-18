const pgtools = require('pgtools');

// This can also be a connection string
// (in which case the database part is ignored and replaced with postgres)

// node migrate create
// node migreate drop

const cmd = process.argv.slice(2);

const config = {
  user: 'postgres',
  password: 'admin',
  port: 5432,
  host: 'localhost'
}

const DB_NAME = "sharekan"

;(() => {
  switch (cmd[0]) {
    case "createDB":
      pgtools.createdb(config, DB_NAME, function (err, res) {
        if (err) {
          console.error(err);
          process.exit(-1);
        }
        console.log(`CREATE DATABASE: ${DB_NAME}`)
        console.log(res);
        
      });
      break;
      
      case "dropDB":
        pgtools.dropdb(config, DB_NAME, function (err, res) {
          if (err) {
            console.error(err);
            process.exit(-1);
          }
        console.log(`DELETED DATABASE: ${DB_NAME}`)
        console.log(res);
      });
      break
  }
})()

