function add2(n1: number, n2: number, showResult: boolean, phrase: string) {
    const result = n1 + n2;
    if (showResult) {
        console.log(phrase + result);
    }
    else {
        return result;
    }
}

let number1: number;
number1 = 5;
const number2 = 2.8;
const printResult2 = true;
let resultPhrase = 'Result is: ';

add2(number1, number2, printResult2, resultPhrase);