import express, {type Application , type Request , type Response} from 'express'
import {config} from "./config";
import {Pool} from "pg";


const app: Application = express()

const pool = new Pool({
    connectionString: config.connection_string
})
// console.log(pool)

const initDB = async () => {
    try {
        // language=SQL format=false
await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE  NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INT,
        is_Active BOOLEAN DEFAULT TRUE,   
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `)
        console.log('Database connected!!')
    }catch (error){
        console.log(error)
    }
}
initDB()

app.get('/', (req: Request, res: Response) => {
// res.send('this is root route')
    res.json({
       message:"this is root route for json"
    })
})


app.listen(config.port, ()=>{
    console.log(`port start on ${config.port}`)
})


