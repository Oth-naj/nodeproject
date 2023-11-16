const express = require('express')
const app = express();
const useRouters = require('./routes/userRoutes')

app.use(express.json());
app.use('/',useRouters);



app.listen(3001, ()=>{
    console.log('server running in port 3001');
})