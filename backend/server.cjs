// backend/server.js
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');



const PORT = process.env.PORT || 5000;


const startServer = async () => {
try {
    await connectDB();
    console.log('Database connected successfully');
    } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
}
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};
startServer()
.catch((error) => {
    console.error('Error starting the server:', error);
    process.exit(1);
});
