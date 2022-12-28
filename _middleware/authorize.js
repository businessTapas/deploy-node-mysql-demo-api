const jwt = require('jsonwebtoken');
var secretKey  = require('./../configKey.json');
var connection = require('./../config');
 
module.exports = authorize;

function authorize(reqHeaders) {
   //console.log(reqHeaders);
   return new Promise(function(resolve, reject) {
    const theToken = reqHeaders.authorization.split(' ')[1];
   jwt.verify(theToken, secretKey.secret, function(err, decoded){
    if(decoded){
        connection.query('SELECT * FROM users where id=?', decoded.sub, function (error, result, fields) {
            if (error) 
            return reject('Internal server error');
            else{  
                //console.log(result);
                    if(result.length > 0)
                    {
                        return resolve(result);
                    }else{
                        return reject('UnauthorizedError');

                    }
                }
            });
    }else{
        return reject('UnauthorizedError');

    }

   })
           
            })
}