"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var RegisterConverterUtil_exports = {};
__export(RegisterConverterUtil_exports, {
  RegisterConverterUtil: () => RegisterConverterUtil
});
module.exports = __toCommonJS(RegisterConverterUtil_exports);
class RegisterConverterUtil {
  static intArrayToByteArray(intArray) {
    const result = new Array();
    for (let i = 0; i < intArray.length; i++) {
      const lowByte = intArray[i] & 255;
      const highByte = intArray[i] >> 8 & 255;
      result[(intArray.length - i) * 2 - 1] = highByte;
      result[(intArray.length - i) * 2 - 2] = lowByte;
    }
    return result;
  }
  static intArrayToFloat32(intArray) {
    const byteArray = new Array(4);
    byteArray[3] = intArray[1] & 255;
    byteArray[2] = intArray[1] >> 8 & 255;
    byteArray[1] = intArray[0] & 255;
    byteArray[0] = intArray[0] >> 8 & 255;
    return new Float32Array(new Uint8Array([byteArray[3], byteArray[2], byteArray[1], byteArray[0]]).buffer)[0];
  }
  static byteArrayToNumber(byteArray) {
    let value = 0;
    for (let i = byteArray.length - 1; i >= 0; i--) {
      value = value * 256 + byteArray[i];
    }
    return value;
  }
  static byteArrayToString(byteArray) {
    let result = "";
    for (let i = byteArray.length - 1; i >= 0; i--) {
      if (byteArray[i] > 0) {
        result += String.fromCharCode(byteArray[i]);
      }
    }
    return result;
  }
  static getRegisterData(array, start, length) {
    const result = new Array(length);
    for (let i = 0; i < length; i++) {
      result[i] = array[start + i];
    }
    return result;
  }
  static getRegisterDataAsString(array, start, length) {
    const intArray = this.getRegisterData(array, start, length);
    return this.byteArrayToString(this.intArrayToByteArray(intArray));
  }
  static getRegisterDataAsInt64(array, start) {
    const intArray = this.getRegisterData(array, start, 4);
    return this.byteArrayToNumber(this.intArrayToByteArray(intArray));
  }
  static getRegisterDataAsInt32(array, start) {
    const intArray = this.getRegisterData(array, start, 2);
    return this.byteArrayToNumber(this.intArrayToByteArray(intArray));
  }
  static getRegisterDataAsInt16(array, start) {
    const intArray = this.getRegisterData(array, start, 1);
    return intArray[0];
  }
  static getRegisterDataAsFloat32(array, start) {
    const intArray = this.getRegisterData(array, start, 2);
    return this.intArrayToFloat32(intArray);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegisterConverterUtil
});
//# sourceMappingURL=RegisterConverterUtil.js.map
