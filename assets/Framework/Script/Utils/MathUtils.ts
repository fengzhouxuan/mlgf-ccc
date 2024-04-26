export class MathUtils {
static getRandomBetween(min: number, max: number, floor: boolean): number {
    return floor ? Math.floor(Math.random() * (max - min + 1) + min) : Math.random() * (max - min) + min;
}
  /**
 * 根据给定的概率数组返回一个随机索引。
 * 使用累积概率方法来选择一个索引，其中每个索引被选择的概率与其在数组中的值成正比。
 * @param probabilities - 一个包含非负数的数组，表示每个索引被选择的概率。
 * @returns 一个随机索引，根据概率数组分布。
 */
static getRandomIndex(probabilities: number[]): number {
  if (probabilities.length === 0) {
    throw new Error('Probabilities array cannot be empty');
  }

  // 计算概率总和
  const totalProbability = probabilities.reduce((acc, prob) => acc + prob, 0);

  // 如果概率总和为零，则返回一个随机索引
  if (totalProbability === 0) {
    return Math.floor(Math.random() * probabilities.length);
  }

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

  // 如果没有触发任何概率（这在理论上是不可能的，除非有浮点精度问题），返回 -1
  return -1;
}
  static isEventTriggered(probability: number): boolean {

    if (probability >= 1) {
      return true;
    }
    if (probability <= 0) {
      return false;
    }

    const randomValue = Math.random();

    return randomValue <= probability;
  }

  /**
   * 从源数组中生成随机数组
   *
   * @param sourceArray 源数组
   * @param targetLength 目标数组长度
   * @returns 生成的随机数组
   */
  public static generateRandomArrayFromSource(sourceArray: any[], targetLength: number): any[] {
    if (targetLength <= 0) return [];

    const targetArray = [...sourceArray];

    // If targetLength is less than sourceArray.length, truncate the array
    if (targetLength < sourceArray.length) {
      targetArray.length = targetLength;
    } else {
      while (targetArray.length < targetLength) {
        const randomIndex = Math.floor(Math.random() * sourceArray.length);
        targetArray.push(sourceArray[randomIndex]);
      }
    }

    // Shuffle the array
    for (let i = targetArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [targetArray[i], targetArray[j]] = [targetArray[j], targetArray[i]];
    }

    return targetArray;
  }


  static Shuffle(array: any[]): any[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }
}