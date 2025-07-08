//sheron
import mysql from 'mysql2/promise';

export const conexao = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', ""
  database: 'shemelau'
});
