export class StringUtils{
    public static IsNullOrEmpty(str:string):boolean{
        return (!str || str.trim().length==0);
    }
    public static Format(format:string,...args:any[]):string{
        return format.replace(/{(\d+)}/g, (match, index) => {
            const argIndex = parseInt(index, 10);
            return args[argIndex] !== undefined ? args[argIndex] : match;
          });
    }

    public static formatCDTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = minutes>=10 ? minutes : `0${minutes}`;
        const formattedSeconds = remainingSeconds>=10 ? remainingSeconds : `0${remainingSeconds}`;
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    public static formatTime(time: number): string {
        if (time <= 0) {
            return "00分00秒";
        }
    
        const secondsInMinute = 60;
        const minutesInHour = 60;
        const hoursInDay = 24;
    
        const seconds = time % secondsInMinute;
        const minutes = Math.floor((time % (minutesInHour * secondsInMinute))/secondsInMinute);
        const hours = Math.floor((time % (hoursInDay * minutesInHour*secondsInMinute))/(minutesInHour * secondsInMinute));
        const days = Math.floor(time / (hoursInDay * minutesInHour * secondsInMinute));
        
        let result = '';
        
        if(days>0){
            return `${days}天${hours}时`;
        }else{
            if(hours>0){
                if(minutes<=0){
                    return `${hours}小时`;
                }else{
                    return `${hours}时${minutes}分`;
                }
            }else{
                return `${minutes}分${seconds}秒`;
            }
        }
    }

    public static formatNumberToFixed(num: number,dec=1): string {
        if (Number.isInteger(num)) {
            return num.toString();
          }
        
          return num.toFixed(dec);
    }
}