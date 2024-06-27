const app = require("./app");
const { port } = require("./secret");


const PORT = port;

app.listen(PORT,()=>{
    console.log(`your server is runnning at http://localhost:${PORT}`);
});