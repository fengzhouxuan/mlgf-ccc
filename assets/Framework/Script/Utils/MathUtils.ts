export class MathUtils{
    static isEventTriggered(probability: number): boolean {
        
        if(probability>=1){
            return true;
        }
        if(probability<=0){
            return false;
        }
      
        const randomValue = Math.random();
      
        return randomValue <= probability;
      }

      static getRandomIndex(probabilities:number[]) {
        // 计算概率总和
        const totalProbability = probabilities.reduce((acc, prob) => acc + prob, 0);
      
        // 生成一个随机数，范围在 0 到总概率之间
        const randomValue = Math.random() * totalProbability;
      
        // 遍历概率数组，累积概率，直到累积值大于随机数
        let accumulatedProbability = 0;
        for (let i = 0; i < probabilities.length; i++) {
          accumulatedProbability += probabilities[i];
          if (randomValue < accumulatedProbability) {
            return i; // 返回触发概率的下标
          }
        }
      
        // 如果没有触发任何概率，返回 -1 或者其他你认为合适的值
        return -1;
      }
}