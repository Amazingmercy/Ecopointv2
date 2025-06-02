const express = require("express");
const app = express();




const port = process.env.PORT || 4900;
app.listen(port, () => console.log(`Server is running on port ${port}`));