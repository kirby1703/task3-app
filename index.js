const express = require('express');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const authRouter = require('./authRouter')

const app = express();
app.use(express.json());
app.use('/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://cyber9:1182@cluster0.5r5vs.mongodb.net/task3?retryWrites=true&w=majority')
        app.listen(PORT, ()=> {console.log(`Server has been listening on ${PORT}`);});
        
    } catch (error) {
        console.log(error);
    }
}

start();