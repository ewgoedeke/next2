
import { Pool } from 'pg';

const pool = new Pool({
  user: 'your_user',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

export const insertFileRecord = async (fileName: string, filePath: string) => {
  const query = `
    INSERT INTO file_uploads (file_name, file_path)
    VALUES ($1, $2)
    RETURNING id
  `;
  const values = [fileName, filePath];

  const result = await pool.query(query, values);
  return result.rows[0].id;
};
