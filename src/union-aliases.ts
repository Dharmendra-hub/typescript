type Combinable = number | string;
type ConversionDescriptor = 'as-number' | 'as-text';


function combine(
    input1: Combinable,
    input2: Combinable,
    resultConversion: ConversionDescriptor
) {
    let result;
    if (typeof input1 === 'number' && typeof input2 === 'number' || resultConversion === 'as-number') {
        result = +input1 + +input2; //by using + we are converting into integer
    }
    else {
        result = input1.toString() + input2.toString();
    }
    return result;
}

const combineAges = combine(30, 26, 'as-number');
console.log(combineAges);

const combineStringAges = combine('30', '15', 'as-number'); // as we have defined a descriptor here then despite of string the values will be converted and added as we have added a check in the function
console.log(combineStringAges);

const combineNames = combine('Dharmendra', 'Singh', 'as-text');
console.log(combineNames);
