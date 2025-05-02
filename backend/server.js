const express= require('express');
const cors= require('cors');    
const app= express();   
const corsOptions={
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE'],
}
app.use(cors(corsOptions));

app.get('/',(req,res)=>{
    res.send("Hello World!")
}
)   
 
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})