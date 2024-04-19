let tt = window["tt"];
export class TTApiUtils{
    static request(url: string, data: object, method: string, success: Function, fail: Function) {
        tt?.request({
          url: url,
          method: method,
          data: data,
          success: function (res) {
            success && success(res.data);
          },
          fail: function (res) {
            fail && fail(res);
          }
        })
      }
}