import express, {type Application , type Request , type Response} from 'express'
import {config} from "./config";
import {Pool} from "pg";


const app: Application = express()

app.use(express.json())

const pool = new Pool({
    connectionString: config.connection_string
})
// console.log(pool)

const initDB = async () => {
    try {
        // language=SQL format=false
await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
res.send('this is root route')
    res.json({
       message:"this is root route json"
    })
})

app.post('/api/v1/users',async (req: Request, res: Response) => {
    try{
        const {name, email, password,age} = req.body
        const result = await pool.query(`
    INSERT INTO users (name,email,password,age) VALUES 
    ($1,$2,$3,$4) RETURNING *
    `, [name, email,password,age])

        // console.log(result)
        res.status(201).json({
            success: true,
            message: 'User created!',
            data: result.rows[0]
        })
    }catch (error){
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error
    })
}})

app.post('/api/v1/users',async (req: Request, res: Response) => {
    try{
        const {name, email, password,age} = req.body
        const result = await pool.query(`
    INSERT INTO users (name,email,password,age) VALUES 
    ($1,$2,$3,$4) RETURNING *
    `, [name, email,password,age])

        // console.log(result)
        res.status(201).json({
            success: true,
            message: 'User created!',
            data: result.rows[0]
        })
    }catch (error){
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error
        })
    }})

app.get('/api/v1/users',async (req: Request, res: Response) => {
    try{
        const result = await pool.query(`
   SELECT * FROM users `)

        // console.log(result)
        res.status(200).json({
            success: true,
            message: 'User created!',
            data: result.rows
        })
    }catch (error){
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error
        })
    }})

app.get('/api/v1/users/:id',async (req: Request, res: Response) => {
    try{
        const {id} = req.params
        const result = await pool.query(`
    SELECT * FROM users WHERE id = $1
    `, [id])
        // console.log(result)

        if(result.rowCount === 0){
            res.status(404).json({
                success: false,
                message: 'User not found!!',

            })
        }
        res.status(200).json({
            success: true,
            message: 'User found with id !!',
            data: result.rows[0]
        })
    }catch (error){
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error
        })
    }})





app.listen(config.port, ()=>{
    console.log(`port start on ${config.port}`)
})


