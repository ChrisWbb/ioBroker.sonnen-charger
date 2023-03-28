class RegisterConverterUtil {

	public static int16ArrayToByteArray(intArray : number[]) : number[]
	{
		const result = new Array<number>();

		for (let i = 0; i < intArray.length; i++) {

			const lowByte =  (intArray[i] & 0xff);
			const highByte = ((intArray[i] >> 8) & 0xff);

			result[((intArray.length) - i) * 2 - 1] = highByte;
			result[((intArray.length) - i) * 2 - 2] = lowByte;
		}

		return result;
	}

	public static int16ArrayToFloat32(intArray : number[]) : number
	{
		const byteArray = new Array<number>(4);
		byteArray[3] = (intArray[1] & 0xff);
		byteArray[2] = ((intArray[1] >> 8) & 0xff);
		byteArray[1] = (intArray[0] & 0xff);
		byteArray[0] = ((intArray[0] >> 8) & 0xff);

		return new Float32Array(new Uint8Array([byteArray[3], byteArray[2], byteArray[1], byteArray[0]]).buffer)[0];
	}

	public static byteArrayToNumber(byteArray: number[]) : number
	{
		let value  = 0;
		for ( let i = byteArray.length - 1; i >= 0; i--) {
			value = (value * 256) + byteArray[i];
		}
		return value;
	}

	private static byteArrayToString(byteArray : number[]) : string
	{
		let result  = "";

		for (let i = byteArray.length-1; i >= 0 ; i--) {
			if (byteArray[i] > 0) {
				result += String.fromCharCode(byteArray[i]);
			}
		}
		return result;
	}

	public static int64ToByteArray(long : number) : number[] {

		const byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

		for ( let index = 0; index < byteArray.length; index ++ ) {
			const byte = long & 0xff;
			byteArray [ index ] = byte;
			long = (long - byte) / 256 ;
		}
		return byteArray;
	}

	public static int64ToInt16Array(int64 : number) : number[] {

		const int16Array: number[] = [];

		for (let i = 48; i >= 0; i -= 16) {
			const chunk = Number((BigInt(int64) >> BigInt(i)) & BigInt(0xffff));
			int16Array.push(chunk);
		}

		return int16Array;
	}

	public static float32ToInt16Array(float32: number) : number[] {

		const float32Array = new Float32Array(1);
		float32Array[0] = float32;
		const int16Array = new Uint16Array(float32Array.buffer)

		return [int16Array[1], int16Array[0]];
	}

	public static getRegisterData(array : number[] | Buffer | Uint16Array, start : number, length : number) : number[]
	{
		const result = new Array<number>(length);

		for (let i = 0; i < length; i++) {
			result[i] = array[start+i];
		}
		return result;
	}

	public static getRegisterDataAsString(array : number[] | Buffer | Uint16Array, start : number, length : number) : string
	{
		const intArray : number[] = this.getRegisterData(array, start, length);
		return this.byteArrayToString(this.int16ArrayToByteArray(intArray));
	}

	// int64 4 Register
	public static getRegisterDataAsInt64(array : number[] | Buffer | Uint16Array, start : number) : number
	{
		const intArray : number[] = this.getRegisterData(array, start, 4);
		return this.byteArrayToNumber(this.int16ArrayToByteArray(intArray));
	}

	// int32 2 Register
	public static getRegisterDataAsInt32(array : number[] | Buffer | Uint16Array, start : number) : number
	{
		const intArray : number[] = this.getRegisterData(array, start, 2);
		return this.byteArrayToNumber(this.int16ArrayToByteArray(intArray));
	}

	// int16 1 Register
	public static getRegisterDataAsInt16(array : number[] | Buffer | Uint16Array, start : number) : number
	{
		const intArray : number[] = this.getRegisterData(array, start, 1);
		return intArray[0];
	}

	// float32 2 Register
	public static getRegisterDataAsFloat32(array : number[] | Buffer | Uint16Array, start : number) : number
	{
		const intArray : number[] = this.getRegisterData(array, start, 2);
		return this.int16ArrayToFloat32(intArray);
	}

}

export {RegisterConverterUtil}