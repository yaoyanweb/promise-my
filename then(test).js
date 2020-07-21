/* 
then的原理
1、then中传递的函数 判断成功和失败函数的返回结果
2、判断是不是promise 如果是promise 就采用它的状态
3、如果不是promise 直接将结果传递下去即可
*/

// const Promise = require('./promise/index2');

// const p = new Promise((resolve,reject)=>{
//     resolve(100)
// })

// let p2 = p.then((data) =>{ 
//   return new Promise((resolve,reject)=>{
//     resolve(new Promise((resolve,reject)=>{
//         resolve('100');
//     }))
//   })
// });

// p2.then(data=>{
//     console.log(data,'1');
// },err=>{
//     console.log(err,'2');
// })




// --------------------------

// 2) 可选参数
// const Promise = require('./promise/index2');

let p = new Promise((resolve,reject)=>{
    resolve(2333)
})

p.then().then().then(data=>{
    console.log(data);
})