/** 
 * The "noop css tag function" is a no-operation (noop) function 
 * that takes a tagged template literal and returns the raw string without modification. 
 * This allows you to use VSCode's CSS formatting features  */
export const css = (strings) => strings.raw[0];

/** Returns a property's value of and object within an array located by another property
 * @param {Array} array to search within
 * @param {String} propertyValueToReturn property whose value you seek
 * @param {String} searchProperty property which value you are looking for
 * @param {String} searchValue
 * @returns {Any} or undefined
 * Example: expect(findItemInArrayOfObjects(arr,'text','value',1)).toBe("one")*/
export const findItemInArrayOfObjects = (array, propertyValueToReturn, searchProperty, searchValue) => {
    for (var a = 0; a < array.length; a++) {
        if (array[a][searchProperty] == searchValue)
            return array[a][propertyValueToReturn];
    }
    return undefined;
};