// promise 的 特点
// 承诺 我答应你。。。 promise是一个类



// 1）里面有三个状态 等待态（默认） 成功态 失败态 一旦成功了  就不能失败,反过来也一样
//  resolve代表的是成功 reject代表的是失败
// 2) 每个promise实例都有一个then方法
// 3) 如果new Promise 的时候 报错了 会变成失败态 (代码抛错也算失败)


/* const Promise = require('./promise/index2.js')
let promise = new Promise((resolve, reject)=>{
   setTimeout(()=>{
    resolve('成功啦')
    // throw new Error('失败啦')
    // reject('失败吗')
   },1000)
    // reject('失败吗')
   
})

promise.then(data=>{
    console.log(data,'1');
},err => {
    console.log(err,'错误啦');
})
promise.then(data=>{
    console.log(data,'2');
},err => {
    console.log(err,'错误啦');
})
 */






// -----------------------------

let fs = require('fs');
// let Promise = require('./promise/index2')

function read(url){
    return new Promise((resolve,reject)=>{
        fs.readFile(url,'utf8',function(err,data){
            if(err) reject(err);
            resolve(data);
        })
    })
}
/* 如果一个promise的then方法中的函数（成功和失败）
返回的结果的一个promise的话，会自动将这个promise执行，
并且采用它的状态，如果成功会将成功的结果向外层的下一个then传递 */
read('./name.txt').then(data=>{
    return read(data);
},err=>{
    console.log(err)
}).then(data=>{
    console.log(data);
},err=>{
    console.log(err)
    /* 如果返回一个普通值 那么会将这个普通值作为下一次的成功的结果 */
    return false; 
}).then(data=>{
    console.log(data);

     /*如果希望不要走下去，throw new Error() 是没有用的 错误也会走reject
      终止promise 可以返回一个pending状态的promise */
   return new Promise(()=>{}); 
}).then(()=>{
    console.log('success');
},()=>{
    console.log('error');
})


/*
只有两种情况会失败 
1、返回一个失败的promise 
2、是抛出异常
 */

/* 
每次执行promise的时候 都会返回一个新的promise实例
*/



