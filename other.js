/* 
    promise all 全部 可以实现等待所以的异步执行完后 拿到统一结果
    解决异步并发 同步处理结果
*/
const Promise = require('./promise/index2');

const fs = require('fs');

function read(url) {
    // 可以解决嵌套问题 但是官方的promise并没有这个方法
    /* let dfd  = Promise.defer();
    fs.readFile(url,'utf8',function(err,data){
        if(err) dfd.reject(err);
        dfd.resolve(data);
    })
    return dfd.promise; */

    return new Promise((resolve,reject)=>{
        fs.readFile(url,'utf8',function(err,data){
            if(err) reject(err);
            resolve(data);
        })
    })
}





Promise.all([1,2,3,read('./name.txt'),read('./age.txt'),5,6]).then(data=>{
    console.log(data);
})








read('./name.txt').finally(data=>{
    console.log(data,'finally')
}).then(data=>{
    console.log(data,'then')
})
