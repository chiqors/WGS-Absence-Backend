import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
    user: 'postgres',
    password: 'admin123',
    host: 'localhost',
    port: 5432,
    database: 'wgs_absence'
})

export default pool