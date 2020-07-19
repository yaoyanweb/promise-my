const PENGDING = 'PENGDING'; //等待
const RESOLVE = 'RESOLVE';  //成功
const REJECTED = 'REJECTED'; // 失败


class Promise {
    // 1.看这个属性 能否在原型上使用
    // 2. 看这个属性是否公用
    constructor(executor) {
        this.status = 'PENGDING'; // 默认是pengding状态
        this.vaule = undefined; //成功的值
        this.reason = undefined; //失败的值
        // 成功函数
        let resolve = (vaule) => {
            // 屏蔽调用  只有等待状态才可以调用
            if (this.status === PENGDING) {
                this.vaule = vaule;
                this.status = RESOLVE;
            }
        };
        // 失败函数
        let reject = (reason) => {
            if (this.status === PENGDING) {
                this.reason = reason;
                this.status = REJECTED;
            }
        };
        try {
            executor(resolve,reject); // 默认执行器 会立刻执行
        } catch (e) {
            reject(e); // 如果发生错误 等于直接调用失败方法
        }


    };

    then(onfulfilled, onrejected) {
        if (this.status === RESOLVE) {
            onfulfilled(this.vaule);
        }
        if (this.status === REJECTED) {
            onrejected(this.reason);
        }
    }
}

module.exports = Promise