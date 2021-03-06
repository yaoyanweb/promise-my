const PENDING = 'PENDING'; //等待
const RESOLVE = 'RESOLVE';  //成功
const REJECTED = 'REJECTED'; // 失败


/* 
     因为promise 都遵循这个规范，规定这个写法应该兼容所有的promise

*/
const resolvePromise = function (promise2, x, resolve, reject) {

    /*
        判断x的值和promise2是不是同一个 如果是同一个 就不要在等待了
        此方法 为了兼容所有的promise,n个库中间 执行的流程是一样的
        直接出错即可
     */

    if (promise2 === x) {
        return reject(new TypeError('类型报错啦'));
    }
    /* 

    */
   let called; // 内部测试的时候  会成功和失败都调用 只调用一次
    if ((typeof x === 'object' &&  x != null) || typeof x === 'function') {
       
        try {
            /* 
               取then 有可能会报错 有可能这个then属性 是通过defineProperty来定义
            */
            let then = x.then;
            if (typeof then === 'function') {
                /* 
                    暂时把当前的then当成一个promise
                */


                /* 
                    为什么要call？
                    是为了保证不再次取then的 值
                    （同时promiseA+ 规范也是这么要求的）
                */
                then.call(x, y => {
                    /* 采用promise的成功结果将值向下一个then传递 */


                    /* 
                        防止多次调用
                    */
                    if (called) {
                        return;
                    };
                    called = true;
                    /* 
                        y 可能还是一个promise 所以要递归调用  resolvePromise 
                        直到解析出来的结果是一个普通值为止
                    */
                    resolvePromise(promise2, y, resolve, reject);
                }, r => {
                    /* 
                        防止多次调用
                    */
                    if (called) {
                        return;
                    };
                    called = true;
                    /* 采用promise的失败结果将值向下一个then传递 */
                    reject(r);
                });
            } else {
                /* 说明x 是一个普通对象 直接成功即可 */
                resolve(x);
            }
        } catch (e) {
            /* 
                防止多次调用
            */
            if (called) {
                return;
            };
            called = true;
            reject(e);
        }
    } else {
        /* 走到这里 说明x是一个普通值 */
        /* 直接让promise2直接执行 */
        resolve(x);
    }
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

class Promise {
    // 1.看这个属性 能否在原型上使用
    // 2. 看这个属性是否公用
    constructor(executor) {
        this.status = PENDING; // 默认是pengding状态
        this.value = undefined; //成功的值
        this.reason = undefined; //失败的值
        this.onResolveCallbacks = []; // 成功事件队列
        this.onRejectedCallbacks = []; // 失败事件队列
        // 成功函数
        let resolve = (value) => {
             
            // 屏蔽调用  只有等待状态才可以调用
            if (this.status === PENDING) {
                this.value = value;
                this.status = RESOLVE;
                // 此处是发布
                this.onResolveCallbacks.forEach(fn => fn());

            }
        };
        // 失败函数
        let reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = REJECTED;
                // 此处是发布
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };
        /* 
            此处的try catch 只能捕获同步的异常
        */
        try {
            executor(resolve, reject); // 默认执行器 会立刻执行
        } catch (e) {
            reject(e); // 如果发生错误 等于直接调用失败方法
        }


    };

    /* 
        then 目前有两个参数 then方法就是异步的 
    */
    then(onfulfilled, onrejected) {
        /* 
            onfulfilled，onrejected为可选参数 可以传空的 所以要判断下
        */
        onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : value=>value;
        
        onrejected = typeof onrejected === 'function' ? onrejected : err=>{
            throw err;
        };

        let promise2 = new Promise((resolve, reject) => { //executor 自动执行 
            // 同步的情况
            if (this.status === RESOLVE) {
                setTimeout(() => {
                    try {
                        let x = onfulfilled(this.value);
                        /* 
                            x可能是普通值，也可能是promise
        
        
                            这个时候就不能用直接用下面这个方法，因为要判断
                            所以这个时候需要一个公共的方法来解析。
                            resolve(x);
                        */



                        /* 
                            此方法是用来解析promise 判断是否是promise
                        */
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })

            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onrejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }

                })
            }
            // 异步的情况
            if (this.status === PENDING) {
                // 如果是异步就先订阅好
                // 此处是订阅

                this.onResolveCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onfulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    })

                })
                // 如果是异步就先订阅好
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onrejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    })
                })
            }
        });
        return promise2;

    }
    catch(){
        return this.then(null,onrejected);
    }
    /* 
        finally 最终的
    */
    finally(cb){
        return this.then(data=>{
            /* 
                有可能finally 里面return了一个promise 所以需要用
                resolve  promise.resolve可以等待那个promise执行完成后再执行
            */
            return Promise.resolve(cb()).then(()=>data);
        },err => {
            return Promise.resolve(cb()).then(()=>{throw err});
        })
    }
    
    static all(values){
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

    static race(promises){
        return new Promise((resolve,reject)=>{
            if(promise.length === 0){
                return;
            }else {
                for(let i = 0;i<promises.length;i++){
                    Promise.resolve(promises[i]).then(data=>{
                        resolve(data);
                        return;
                    },err=>{
                        reject(err);
                        return;
                    })
                }
            }
        })
    }   


    static resolve(param){
        if(param instanceof Promise){
            return param
        };
        return new Promise((resolve,reject)=>{
            if(isPromise(param)){
                setTimeout(()=>{
                    param.then(resolve,reject);
                })
            }else {
                resolve(param)
            }
        })
    }

    static reject(reason){
        return new Promise((resolve,reject)=>{
            reject(reason)
        })
    }
}

Promise.defer = Promise.deferred = function(){
    let dfd = {};
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}

module.exports = Promise




