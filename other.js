/* 
    promise all 全部 可以实现等待所以的异步执行完后 拿到统一结果
    解决异步并发 同步处理结果
*/
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

/* 
    判断是不是一个promsie
*/
const isPromise = (value) =>{
    /* 
        首先判断是不是对象或者函数
    */
    if((typeof value === 'object' && value !== null) || typeof value === 'function'){
        /* 
            再判断是否含有then方法 
        */
        return typeof value.then === 'function';
    }else {
        return false;
    }
}


Promise.all = function(values){
    /* 
        promsie all 返回的 是一个promise 所以
        这一步 应该不需要解释吧
    */
    return new Promise((resolve,reject)=>{
       
        /* 
            用来存放结果
        */
        let arr = [];
        /* 
            判断是否执行完 标记用的
        */
        let index = 0;
         /* 
            此方法用来判断 数组里面所有的 promise或者普通值 是否全部执行完成
        */
        function processData(key,value){
            /* 
                这样赋值 而不是用push 是为了保持原来的顺序
            */
            arr[key] = value;
            index++;
            if(values.length === index){
                resolve(arr);
            }
        }
        for(let i = 0;i < values.length; i++){
            let current = values[i];
            /* 
                如果是promise 就调用then方法
            */
            if(isPromise(current)){
                 current.then(data=>{
                    processData(i,data);
                },reject);
            }else {
                processData(i,current)
            }
        }
    })

}

// Promise.all([1,2,3,read('./name.txt'),read('./age.txt'),5,6]).then(data=>{
//     console.log(data);
// })




/* 
    finally 最终的
*/