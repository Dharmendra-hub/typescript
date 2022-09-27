function add(n1: number, n2: number) {
    return n1 + n2;
}

//This is for void
function printResult(num: number): void {
    console.log('Result: ' + num);
}

function addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
    const result = n1 + n2;
    cb(result);
}

printResult(add(5, 26));

let combineValues: (a: number, b: number) => number;

combineValues = add;

console.log(combineValues(8, 8));

addAndHandle(10, 90, (result) => {
    console.log(result);
});