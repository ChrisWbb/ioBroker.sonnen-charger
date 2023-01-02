class RegisterConverterUtil {

    private static intArrayToByteArray(intArray : number[]) : number[]
    {
        let result = new Array<number>();
    
        for (let i = 0; i < intArray.length; i++) {
    
            let lowByte =  (intArray[i] & 0xff);
            let highByte = ((intArray[i] >> 8) & 0xff);
    
            result[((intArray.length) - i) * 2 - 1] = highByte;
            result[((intArray.length) - i) * 2 - 2] = lowByte;
          }
    
        return result;
    }
    
    private static intArrayToFloat32(intArray : number[]) : number
    {
        let byteArray = new Array<number>(4);
        byteArray[3] = (intArray[1] & 0xff);
        byteArray[2] = ((intArray[1] >> 8) & 0xff);
        byteArray[1] = (intArray[0] & 0xff);
        byteArray[0] = ((intArray[0] >> 8) & 0xff);

        return new Float32Array(new Uint8Array([byteArray[3], byteArray[2], byteArray[1], byteArray[0]]).buffer)[0]; 
    }

    private static byteArrayToNumber(byteArray: number[]) : number
    {
        let value : number = 0;
        for ( var i = byteArray.length - 1; i >= 0; i--) {
            value = (value * 256) + byteArray[i];
        }
    
        return value;
    };

    private static byteArrayToString(byteArray : number[]) : string
    {
        let result : string = "";
    
        for (let i = byteArray.length-1; i >= 0 ; i--) { 
            if (byteArray[i] > 0) {
                result += String.fromCharCode(byteArray[i]);
            }
        }
    
        return result;
    }

    private static getRegisterData(array : number[], start : number, length : number) : number[] 
    {
        let result = new Array<number>(length);

        for (let i = 0; i < length; i++) {
            result[i] = array[start+i];
        }

        return result;
    }

    public static getRegisterDataAsString(array : number[], start : number, length : number) : string 
    {
        let intArray : number[] = this.getRegisterData(array, start, length);
        return this.byteArrayToString(this.intArrayToByteArray(intArray));
    }

    // int64 4 Register
    public static getRegisterDataAsInt64(array : number[], start : number) : number 
    {
        let intArray : number[] = this.getRegisterData(array, start, 4);
        return this.byteArrayToNumber(this.intArrayToByteArray(intArray));
    }

    // int32 2 Register
    public static getRegisterDataAsInt32(array : number[], start : number) : number 
    {
        let intArray : number[] = this.getRegisterData(array, start, 2);
        return this.byteArrayToNumber(this.intArrayToByteArray(intArray));
    }

    // int16 1 Register
    public static getRegisterDataAsInt16(array : number[], start : number) : number 
    {
        let intArray : number[] = this.getRegisterData(array, start, 1);
        return intArray[0];
    }

    // float32 2 Register
    public static getRegisterDataAsFloat32(array : number[], start : number) : number 
    {
        let intArray : number[] = this.getRegisterData(array, start, 2);
        return this.intArrayToFloat32(intArray);
    }

}

export {RegisterConverterUtil}