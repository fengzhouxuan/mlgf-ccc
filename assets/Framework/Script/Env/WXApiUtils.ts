let wx = window["wx"];
export class WXApiUtils{
    public static request(url:string,method:string,data:any,success?:(res)=>void,fail?:(res)=>void){
        wx?.request({
            url: url,
            method: method,
            data: data,
            success: function (res) {
              success && success(res.data);
            },
            fail: function (res) {
              fail && fail(res);
            }
          });
    }
}