// promise 的 特点
// 承诺 我答应你。。。 promise是一个类



// 1）里面有三个状态 等待态（默认） 成功态 失败态 一旦成功了  就不能失败,反过来也一样
//  resolve代表的是成功 reject代表的是失败
// 2) 每个promise实例都有一个then方法
// 3) 如果new Promise 的时候 报错了 会变成失败态 (代码抛错也算失败)


const Promise = require('./promise/index2.js')
let promise = new Promise((resolve, reject)=>{
    throw new Error('失败啦')
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







// -----------------------------


// let Primise = require('./promise/index2')
// console.log(Primise)
