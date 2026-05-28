// 1. LINEAR SEARCH
export const linearSearch = (array, target) => {
    const steps = [];
    for (let i = 0; i < array.length; i++) {
        steps.push({
            array: [...array],
            currentIndex: i,
            foundIndex: null,
            comparisons: i + 1,
            swaps: 0,
            status: "COMPARING",
            pointers: [i]
        });

        if (array[i] === target) {
            steps.push({
                array: [...array],
                currentIndex: i,
                foundIndex: i,
                comparisons: i + 1,
                swaps: 0,
                status: "FOUND",
                pointers: [i]
            });
            return steps;
        }
    }
    return steps;
};

// 2. BINARY SEARCH (Assumes Sorted Data Array Context)
export const binarySearch = (array, target) => {
    const steps = [];
    let left = 0;
    let right = array.length - 1;
    let comparisons = 0;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        comparisons++;

        steps.push({
            array: [...array],
            currentIndex: mid,
            foundIndex: null,
            comparisons,
            swaps: 0,
            status: "COMPARING",
            pointers: [left, mid, right] // Highlights search bounds and pivot midpoint
        });

        if (array[mid] === target) {
            steps.push({
                array: [...array],
                currentIndex: mid,
                foundIndex: mid,
                comparisons,
                swaps: 0,
                status: "FOUND",
                pointers: [mid]
            });
            return steps;
        } else if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return steps;
};

// 3. JUMP SEARCH
export const jumpSearch = (array, target) => {
    const steps = [];
    const n = array.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    let comparisons = 0;

    while (array[Math.min(step, n) - 1] < target) {
        comparisons++;
        steps.push({
            array: [...array],
            currentIndex: Math.min(step, n) - 1,
            foundIndex: null,
            comparisons,
            swaps: 0,
            status: "COMPARING",
            pointers: [prev, Math.min(step, n) - 1]
        });
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) return steps;
    }

    while (array[prev] < target) {
        comparisons++;
        steps.push({
            array: [...array],
            currentIndex: prev,
            foundIndex: null,
            comparisons,
            swaps: 0,
            status: "COMPARING",
            pointers: [prev]
        });
        prev++;
        if (prev === Math.min(step, n)) return steps;
    }

    comparisons++;
    steps.push({
        array: [...array],
        currentIndex: prev,
        foundIndex: null,
        comparisons,
        swaps: 0,
        status: "COMPARING",
        pointers: [prev]
    });

    if (array[prev] === target) {
        steps.push({
            array: [...array],
            currentIndex: prev,
            foundIndex: prev,
            comparisons,
            swaps: 0,
            status: "FOUND",
            pointers: [prev]
        });
    }
    return steps;
};

// 4. FIBONACCI SEARCH (Assumes Sorted Data Array Context)
export const fibonacciSearch = (array, target) => {
    const steps = [];
    const n = array.length;
    let fibMMm2 = 0; 
    let fibMMm1 = 1; 
    let fibM = fibMMm2 + fibMMm1; 
    let comparisons = 0;

    while (fibM < n) {
        fibMMm2 = fibMMm1;
        fibMMm1 = fibM;
        fibM = fibMMm2 + fibMMm1;
    }

    let offset = -1;

    while (fibM > 1) {
        let i = Math.min(offset + fibMMm2, n - 1);
        comparisons++;

        steps.push({
            array: [...array],
            currentIndex: i,
            foundIndex: null,
            comparisons,
            swaps: 0,
            status: "COMPARING",
            pointers: [i]
        });

        if (array[i] < target) {
            fibM = fibMMm1;
            fibMMm1 = fibMMm2;
            fibMMm2 = fibM - fibMMm1;
            offset = i;
        } else if (array[i] > target) {
            fibM = fibMMm2;
            fibMMm1 = fibMMm1 - fibMMm2;
            fibMMm2 = fibM - fibMMm1;
        } else {
            steps.push({
                array: [...array],
                currentIndex: i,
                foundIndex: i,
                comparisons,
                swaps: 0,
                status: "FOUND",
                pointers: [i]
            });
            return steps;
        }
    }

    if (fibMMm1 && array[offset + 1] === target) {
        comparisons++;
        steps.push({
            array: [...array],
            currentIndex: offset + 1,
            foundIndex: offset + 1,
            comparisons,
            swaps: 0,
            status: "FOUND",
            pointers: [offset + 1]
        });
    }
    return steps;
};