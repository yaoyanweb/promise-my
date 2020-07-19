const PENDING = 'pending';
const FULFILLED = 'funlfilled';
const REJECTED = 'rejected';
function Promise(executor){
    let self = this;
    self.status = PENDING;
    self.onFulfilled = []; //成功的回调
    self.onRejected = []; //失败的回调
    function resolve(value){
        if(self.status === PENDING){
            self.status = FULFILLED;
            self.value = value;
            self.onFulfilled.forEach(fn => fn());
        }
    };
    function reject(reason){
        if(self.status === PENDING){
            self.status = REJECTED;
            self.value = reason;
            self.onRejected.forEach(fn=>fn())
        }
    }
    try{
        executor(resolve,reject)
    } catch(e){
        reject(e)
    }
}

Promise.prototype.then = function(onFulfilled,onRejected){
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
        throw reason
    };
    let selt = this;
    let promise2 = new Promise((resolve,reject) => {
        if(self.status === FULFILLED){
            setTimeout(()=>{
                try{
                    let x = onFulfilled(self.value);
                    resolvePromise(promise2,x,resolve,reject);
                }catch(e){
                    reject(e);
                }
            })
        }else if(self.status === REJECTED){
            setTimeout(()=>{
                try{
                    let x = onRejected(self.reason);
                    resolvePromise(promise2,x,resolve,reject);
                }catch(e){
                    reject(e);
                }
            })
        }else if(self.status === PENDING){
            self.onFulfilled.push(()=>{
                setTimeout(()=>{
                    try{
                        let x = onFulfilled(self.value);
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e);
                    }
                })
            })
            self.onRejected.push(()=>{
                setTimeout(()=>{
                    try{
                        let x = onRejected(self.reason);
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e);
                    }
                });
            })
        }
        return promise2;
    })
}

function resolvePromise(promise2,x,resolve,reject){
    let self = this;
    if(promise2 === x){
        reject(new TypeError('Chanining cycle'));
    }
    if(x&&typeof x === 'object' || typeof x === 'function'){
        let used; //promise a+ 2.3.3  只调用一次
        try {   
            let then = x.then;
            if(typeof then === 'function'){
                // promise a+ 2.3.3.1
                then.call(z,y=>{
                    if(used) return;
                    used = true;
                    resolvePromise(promise2,x,resolve,reject);
                },r=>{
                    if(used) return;
                    used = true;
                    reject(r);
                })
            }else {
                // promise a+ 2.3.3.4 
                if(used) return;
                used = true;
                resolve(x);
            }
        }catch(e){
            if(used) return;
            used = true;
            reject(e);
        }
    }else {
        // promise a+ 2.3.3.4 
        resolve(x);
    }
}

Promise.defer = Promise.deferred = function(){
    let dfd = {};
    dfd.promise = new  Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}
// modules.exports = Promise;