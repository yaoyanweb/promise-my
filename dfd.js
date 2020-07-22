const Promise = require('./promise/index2');

const fs = require('fs');

function read(url) {
    // 可以解决嵌套问题 但是官方的promise并没有这个方法
    let dfd  = Promise.defer();
    fs.readFile(url,'utf8',function(err,data){
        if(err) dfd.reject(err);
        dfd.resolve(data);
    })
    return dfd.promise;
}

read('./name.txt').then(data=>{
    console.log(data,'data')
})
console.log(read());