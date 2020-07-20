const PENGDING = 'PENGDING'; //等待
const RESOLVE = 'RESOLVE';  //成功
const REJECTED = 'REJECTED'; // 失败


/* 
     因为promise 都遵循这个规范，规定这个写法应该兼容所有的promise

*/ 
const resolvePromise = function(promise2, x, resolve, reject){

    /*
        判断x的值和promise2是不是同一个 如果是同一个 就不要在等待了
        直接出错即可
     */
    if(promise2 === x){
        return reject(new TypeError('类型报错啦'));
    }
    /* 

    */
    if(typeof x === 'object' && typeof x !== null || typeof === 'function'){
        let then = x.then;
        try{
            /* 
               取then 有可能会报错 有可能这个then属性 是通过defineProperty来定义
            */
            let then = x.then;
            if(typeof then === 'function'){
                /* 
                    暂时把当前的then当成一个promise
                */


                /* 
                    为什么要call？
                    是为了保证不再次取then的值
                    （同时promiseA+ 规范也是这么要求的）
                */
                then.call(x);
            }else{
                /* 说明x 是一个普通对象 直接成功即可 */
                resolve(x);
            }
        }catch(e){

        }
    }else {
        /* 走到这里 说明x是一个普通值 */
        /* 直接让promise2直接执行 */
        resolve(x);
    }
}

class Promise {
    // 1.看这个属性 能否在原型上使用
    // 2. 看这个属性是否公用
    constructor(executor) {
        this.status = 'PENGDING'; // 默认是pengding状态
        this.vaule = undefined; //成功的值
        this.reason = undefined; //失败的值
        this.onResolveCallbacks = []; // 成功事件队列
        this.onRejectedCallbacks = []; // 失败事件队列
        // 成功函数
        let resolve = (vaule) => {
            // 屏蔽调用  只有等待状态才可以调用
            if (this.status === PENGDING) {
                this.vaule = vaule;
                this.status = RESOLVE;
                // 此处是发布
                this.onResolveCallbacks.forEach(fn => fn());

            }
        };
        // 失败函数
        let reject = (reason) => {
            if (this.status === PENGDING) {
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

    then(onfulfilled, onrejected) {
        let promise2 = new Promise((resolve, reject) => { //executor 自动执行 
            // 同步的情况
            if (this.status === RESOLVE) {
                setTimeout(() => {
                    try {
                        let x = onfulfilled(this.vaule);
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
                    try{
                        let x = onrejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    }catch(e){
                        reject(e);
                    }
                    
                })
            }
            // 异步的情况
            if (this.status === PENGDING) {
                // 如果是异步就先订阅好
                // 此处是订阅
                
                this.onResolveCallbacks.push(() => {
                    setTimeout(()=>{
                        try{
                            let x = onfulfilled(this.vaule);
                            resolvePromise(promise2, x, resolve, reject);
                        }catch(e){
                            reject(e);
                        }
                    })
                    
                })
                // 如果是异步就先订阅好
                this.onRejectedCallbacks.push(() => {
                    setTimeout(()=>{
                        try{
                            let x = onrejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        }catch(e){
                            reject(e);
                        }
                    })
                })
            }
        });
        return promise2;

    }
}

module.exports = Promise




