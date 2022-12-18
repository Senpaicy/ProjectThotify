const { ObjectId } = require("mongodb");

module.exports = {
  checkId(id, variableName) {
    if (!id) `Error: You must provide a ${variableName}.`;
    if (typeof id !== "string")
      throw `Error: ${variableName} must be a string.`;

    id = id.trim();

    if (id.length === 0)
      throw `Error: ${variableName} cannot be an empty string.`;
    if (!ObjectId.isValid(id))
      `Error: ${variableName} is an invalid object id.`;

    return id;
  },
  checkString(stringVal, variableName, allowNumbers) {
    if (!stringVal) throw `Error: You must provide a ${variableName}.`;
    if (typeof stringVal !== "string")
      throw `Error: ${variableName} must be a string.`;

    stringVal = stringVal.trim();

    if (stringVal.length === 0)
      throw `Error: ${variableName} cannot be an empty string.`;

    if (allowNumbers) return stringVal;

    if (!/^[a-zA-Z]+$/.test(stringVal))
      throw `Error: ${stringVal} should only contain letters.`;
    return stringVal;
  },
  checkArray(arr, variableName, typeOfArray, allowEmptyArray) {
    if (!arr) throw `Error: You must provide a ${variableName}.`;
    if (!Array.isArray(arr)) throw `Error: ${varName} must be an array.`;
    if (!allowEmptyArray && arr === [])
      throw `Error: ${varName} cannot be empty.`;

    // Loops through array and checks if array is of the correct type.
    for (i in arr) {
      if (typeof arr[i] !== typeOfArray) {
        if (typeOfArray === "string") {
          console.log(arr[i]);
          arr[i] = arr[i].trim();
          if (arr[i].length === 0)
            throw `Error: Object at index ${i} cannot be an empty string.`;
        }
      }
    }

    return arr;
  },
};
