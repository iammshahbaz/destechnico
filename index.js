const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const sellerRouter = require('./Routes/sellerRoutes');
const userRouter = require('./Routes/userRoutes');
const buyerRouter = require('./Routes/buyerRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.get("/", async (req, res) => {
    res.send("Welcome to Homepage ")
})

app.use('/api/users', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/buyer', buyerRouter);

app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
