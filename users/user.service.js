//const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var connection = require('./../config');
var configKey = require('./../configKey.json');
const { param } = require('./users.controller');
var secretkey = configKey.secret;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

 async function authenticate(req, res) {
    //console.log(secret.secretkey);
    //console.log(req.headers['Authorization']);
    //var today = new Date();
    var user = {
        "username":req.username,
        "password":req.password,
    }
    //console.log(user.username);
    var sql = "SELECT * FROM users where username =?"; 
    let result = await myquery(sql, [user.username]); 
            //console.log(result);
                if(result.length > 0)
                {
                    const match = await bcrypt.compare(user.password, result[0]['hash']);
                    if(!match){
                    throw 'Password is incorrect';
                    //throw 'Password is incorrect';
                    }
                    if(match){
                        //else{
                        const token = jwt.sign({ sub: result[0]["id"] }, secretkey, { expiresIn: '1d' });
                        result[0]['token'] = token;
                        //console.log(token);
                        return result;
                    }
                }
                else
                {
                    throw 'UnauthorizedError';
                    //throw new Error('UnauthorizedError');    
                }
            
}

async function getAll() {
    var sql = "SELECT * FROM users"; 
    let result = await myquery(sql,'');  
                //console.log(result);
                    if(result.length > 0)
                    {
                            return result;
                    }
                
}

async function getById(id) {
    var sql = "SELECT * FROM users where id =?"; 
    let result = await myquery(sql, [id]); 
                //console.log(result);
                    if(result.length > 0)
                    {
                            return result;
                    }else{
                        throw 'User not found';
                    }
            
}

async function create(req, res) {
    //hash =  bcrypt.hash(req.password, 10);
              //      console.log(hash);
        var today = new Date();
    var user = {
            "username":req.username,
            "firstname":req.firstname,
            "lastname":req.lastname,
            "created_at":today,
            "updated_at":today
    }
    //console.log(user);
    var sql = "SELECT * FROM users WHERE username = ?"; 
    let result = await myquery(sql, [user.username]);
            //console.log(result);
                if(!result.length)
                {
                   const hashed = await bcrypt.hash(req.password, 10);
                    user.hash =  hashed;
                    //console.log(user);
                    var insSql = "insert into users SET?"; 
                    let insResult = await myquery(insSql, [user]);
                         if(insResult){
                            return insResult;
                         }else{
                            throw 'Internal server error';
                        }
                }else{
                    throw 'This username is already exists';

                }

    
}


async function update(id, params) {
        const user = await getById(id);
//console.log(user[0].username);
    // validate
    const usernameChanged = params.username && user[0].username !== params.username;
    //console.log(usernameChanged);
        if(usernameChanged){
    //console.log(user.username);
    var sql = "SELECT * FROM users WHERE username = ?"; 
    let result = await myquery(sql, [params.username]);
                        if(result.length)
                        {
                            throw 'Username ' + params.username + ' is already taken';
                        }  
                        
                    }
                    var updateUser = {
                        "username":params.username,
                        "firstname":params.firstname,
                        "lastname":params.lastname,
                     }           
                     updateUser.updated_at = new Date();
         if (params.password) {
            hasedPassord = await bcrypt.hash(params.password, 10);
            updateUser.hash = hasedPassord;
         }
          //console.log(updateUser);
          var updateSql = "update users SET? where id = ?";
          let updateResult = await myquery(updateSql, [updateUser,id]);
          //console.log(updateResult);
              if(updateResult){
                 return updateResult;
              }
    }

async function _delete(id) {
    var sql = "delete from users where id =?"; 
    let result = await myquery(sql, [id]); 
                //console.log(result);
                    if(result)
                    {
                            return result;
                    }else{
                        throw 'User not found';
                    }
            
}

// helper functions

async function myquery(sqlQuery, param){
    return new Promise(function(resolve, reject){
        //console.log(sqlQuery);       
        //const sqlStr = connection.format(sqlQuery, param);
        //console.log(sqlStr);
            connection.query(sqlQuery, param, function(error,result,fields){
                if (error)
                return reject('Internal server error');
                else{  
                    resolve(result);  
                }
            });
        });        
}

