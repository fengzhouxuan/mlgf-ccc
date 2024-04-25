
self.onmessage = function(e) {
    console.log(e.data);//主线程推送来的消息
    let sum = 0;
    for (let i = 0; i < 100000; i++) {
        sum+=i;
    }
    self.postMessage(sum) //发送消息到主线程
}