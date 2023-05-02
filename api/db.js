const { MongoClient } = require("mongodb");
const client = new MongoClient("******************* PUT MONGO CONNECTION URI HERE *******************");

const db = {
    connect: async ()=>{client.connect(); return true},
    disconnect: async ()=>{client.close(); return true},
    blogDatabase: client.db("******************* PUT NAME OF DATABASE HERE *******************"),
}

/*
    ******************* DATABASE NEEDS LAYOUT OF 'DBNAME > blog' *******************
*/
module.exports = { db };