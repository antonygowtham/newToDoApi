import express from "express"
import pool from "./db.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {v4 as uuidv4} from "uuid";
import cors from "cors"

const app=express()
const port=4000

app.use(cors())
app.use(express.json())


// get all todos
app.get('/todos/:userId', async (req, res) => {
    const {userId} =req.params
    try {
        const todos = await pool.query('SELECT * FROM newtasks WHERE user_id=$1 AND is_finished=false',[userId])
        res.json(todos.rows )
    } catch (err) {
        console.error(err)
    }
});

//post a new todo
app.post('/todos',async (req,res)=>{
    const {user_id,title,progress,date,category}=req.body;
    const id=uuidv4();
    let is_finished=false;
    progress == 100 ? is_finished =true :false
    try {
        const newTodo=await pool.query('INSERT INTO newtasks (id, title, date, category, progress, is_finished, user_id)VALUES($1,$2,$3,$4,$5,$6,$7)',
            [id,title,date,category,progress,is_finished,user_id])
        res.status(200).json(newTodo)
    } catch (error) {
        console.log(error)
    }
})

//edit a todo
app.patch('/todos/:id',async (req,res)=>{
    const {id}=req.params
    const {user_id,title,progress,date,category}=req.body
    let is_finished=false
    progress == 100 ? is_finished =true :false
    try {
        const editTodo=await pool.query("UPDATE newtasks SET user_id=$1, title=$2,progress=$3,date=$4,category=$5,is_finished=$6 WHERE id=$7;",
            [user_id,title,progress,date,category,is_finished,id])
        res.json(editTodo)
    } catch (error) {
        console.error(error)
    }
})

//delete a todo
app.delete('/todos/:id',async (req,res)=>{
    const {id}=req.params
    try{
        const deleteTodo=await pool.query('DELETE FROM newtasks WHERE id = $1',[id])
        res.json(deleteTodo)
    }catch(error){
        console.error(error)
    }
})

//filter
app.get('/todos/:userId/:type/:value', async (req, res) => {
    const {userId,type,value} =req.params
    try {
        
        let query=`SELECT * FROM newtasks WHERE user_id=${userId} AND ${type}=$1 AND is_finished=false`
        if(type=='is_finished'){
            query=`SELECT * FROM newtasks WHERE user_id=${userId} AND ${type}=$1`
        }
        
        const todos = await pool.query(query,[value])
        res.json(todos.rows )
    } catch (err) {
        console.error(err)
    }
});

//get types
app.get('/types/:userId', async (req, res) => {
    const {userId} =req.params
    try {
        const query=`SELECT DISTINCT category FROM newtasks WHERE user_id=${userId} AND is_finished=false`
        const todos = await pool.query(query)
        res.json(todos.rows )
    } catch (err) {
        console.error(err)
    }
});


//signup
app.post('/signup',async(req,res)=>{
    const {email,password}=req.body
    const salt=bcrypt.genSaltSync(10)
    const hashedPassword=bcrypt.hashSync(password,salt)
    try {
        const result =await pool.query("INSERT INTO newusers(email,hashed_password)VALUES($1,$2) RETURNING id",[email,hashedPassword])
        const userId = result.rows[0].id
        const token=jwt.sign({email},'secret',{expiresIn : '1hr'})
        res.json({email,token,userId})
    } catch (error) {
        if(error){
            res.json({detail:error.detail})
        }
    }
})

//login
app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try {
        const users=await pool.query("SELECT * FROM newusers WHERE email = $1",[email])
        
        if(!users.rows.length) return res.json({detail:"user does not exist"})

        const success=await bcrypt.compare(password,users.rows[0].hashed_password)
        if(success){
            const userId=users.rows[0].id
            const token=jwt.sign({email},'secret',{expiresIn : '1hr'})
            res.json({'email':users.rows[0].email,token,userId})
        }else{
            res.json({failed:"password mismatch !"})
        }

    } catch (error) {
        console.error(log);
    }
})

app.listen(port,()=>console.log(`server listening on port ${port}`))