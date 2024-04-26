import { Quat, Vec2, Vec3 } from "cc";

export class VecUtils {
    public static rotateVec2ByRadians(radians: number, vector: Vec2): Vec2 {
        let angle = radians;
        let originalVector = vector;

        let newX = originalVector.x * Math.cos(angle) - originalVector.y * Math.sin(angle);
        let newY = originalVector.x * Math.sin(angle) + originalVector.y * Math.cos(angle);

        return new Vec2(newX, newY);
    }

    public static rotateVector3D(vector: Vec3, axis: Vec3, angleInRadians: number): Vec3 {
        // 确保轴是单位向量
        const axisLength = Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z);
        const normalizedAxis=new Vec3( axis.x / axisLength, axis.y / axisLength, axis.z / axisLength );
      
        // 旋转矩阵的系数
        const cosTheta = Math.cos(angleInRadians);
        const sinTheta = Math.sin(angleInRadians);
        const oneMinusCosTheta = 1 - cosTheta;
      
        // 旋转矩阵绕任意轴
        const rotatedVector=new Vec3(
         vector.x * (normalizedAxis.x * normalizedAxis.x * oneMinusCosTheta + cosTheta) +
              vector.y * (normalizedAxis.x * normalizedAxis.y * oneMinusCosTheta - normalizedAxis.z * sinTheta) +
              vector.z * (normalizedAxis.x * normalizedAxis.z * oneMinusCosTheta + normalizedAxis.y * sinTheta),
          vector.x * (normalizedAxis.y * normalizedAxis.x * oneMinusCosTheta + normalizedAxis.z * sinTheta) +
              vector.y * (normalizedAxis.y * normalizedAxis.y * oneMinusCosTheta + cosTheta) +
              vector.z * (normalizedAxis.y * normalizedAxis.z * oneMinusCosTheta - normalizedAxis.x * sinTheta),
          vector.x * (normalizedAxis.z * normalizedAxis.x * oneMinusCosTheta - normalizedAxis.y * sinTheta) +
              vector.y * (normalizedAxis.z * normalizedAxis.y * oneMinusCosTheta + normalizedAxis.x * sinTheta) +
              vector.z * (normalizedAxis.z * normalizedAxis.z * oneMinusCosTheta + cosTheta)
        );
      
        return rotatedVector;
      }

    public static toVec3FromYtoZ(source: Vec2, out?: Vec3): Vec3 {
        if (!out) {
            out = new Vec3();
        }
        out.x = source.x;
        out.z = source.y;
        return out;
    }
}