var prop =require('./db_properites');
var mysql =require('mysql');


module.exports ={
    getConnection : ()=>{
        return mysql.createConnection(prop);
    }
}