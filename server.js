const express = require('express');
const connectDB = require('./config/db');
const app = express();


//Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

//Init middleware
app.use(express.json({ extended: false}));


app.use(express.static('public'));

// Make A directory Publicly Accessible
app.use('/uploads', express.static('uploads'));

//Define Routes
app.get('/',(req, res)=>res.send('APi Running'));
app.use('/api/user',require('./routes/api/user'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/property',require('./routes/api/property'));
app.use('/api/slider',require('./routes/api/slider'));
app.use('/api/loan_type',require('./routes/api/loan'));
app.use('/api/appraisal_type',require('./routes/api/appraisal'));
app.use('/api/order',require('./routes/api/order'));
app.use('/api/client',require('./routes/api/client'));


