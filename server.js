const express = require('express');
const mongoose = require('mongoose');
const app = express();
const routes = require('./routes/route');

const PORT = 3000;

mongoose.connect('mongodb://localhost/polling_system', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
