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

    public static formatNumberToFixed(num: number,dec=1): string {
        if (Number.isInteger(num)) {
            return num.toString();
          }
        
          return num.toFixed(dec);
    }
}