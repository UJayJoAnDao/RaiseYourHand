// 請用 ES6 語法寫出快速排序法

function QuickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    const pivot = arr[0];
    const left = [];
    const right = [];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return QuickSort(left).concat(pivot, QuickSort(right));
}

console.log(QuickSort([5, 3, 8, 2, 9]));