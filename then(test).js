/* 
then的原理
1、then中传递的函数 判断成功和失败函数的返回结果
2、判断是不是promise 如果是promise 就采用它的状态
3、如果不是promise 直接将结果传递下去即可
*/

const Promise = require('./promise/index2');

const p = new Promise((resolve,reject)=>{
    resolve(100)
})

let p2 = p.then((data) =>{ 
    return data;
    // throw new Error('我报错啦');
})
p2.then(data => {
    console.log(data,'22')
},err=>{
    console.log(err,'11')
}).then(data => {
    console.log(data,'33')
},err=>{
    console.log(err,'44')
})