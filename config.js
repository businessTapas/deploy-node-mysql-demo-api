var mysql = require('mysql');
var connection = mysql.createConnection({

    host           :'localhost',
    user           :'root',
    password       :'',
    database       :'node_test'
});

connection.connect(function(err){
        if(!err){
            console.log('database is connected successfully');
        }else{
            console.log('database connection error');
        }
}
);

module.exports = connection;
