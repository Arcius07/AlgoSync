// 1. BUBBLE SORT
export const bubbleSort = (array) => {
    const steps = [];
    let temp = [...array];
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < temp.length - 1; i++) {
        for (let j = 0; j < temp.length - i - 1; j++) {
            comparisons++;
            steps.push({
                array: [...temp],
                comparing: [j, j + 1],
                swapping: [],
                comparisons,
                swaps,
                status: "COMPARING"
            });

            if (temp[j] > temp[j + 1]) {
                swaps++;
                [temp[j], temp[j + 1]] = [temp[j + 1], temp[j]];
                steps.push({
                    array: [...temp],
                    comparing: [],
                    swapping: [j, j + 1],
                    comparisons,
                    swaps,
                    status: "SWAPPING"
                });
            }
        }
    }
    return steps;
};

// 2. INSERTION SORT
export const insertionSort = (array) => {
    const steps = [];
    let temp = [...array];
    let comparisons = 0;
    let swaps = 0;

    for (let i = 1; i < temp.length; i++) {
        let key = temp[i];
        let j = i - 1;

        while (j >= 0) {
            comparisons++;
            steps.push({
                array: [...temp],
                comparing: [j, j + 1],
                swapping: [],
                comparisons,
                swaps,
                status: "COMPARING"
            });

            if (temp[j] > key) {
                swaps++;
                temp[j + 1] = temp[j];
                j--;
                steps.push({
                    array: [...temp],
                    comparing: [],
                    swapping: [j + 1, j + 2],
                    comparisons,
                    swaps,
                    status: "SWAPPING"
                });
            } else {
                break;
            }
        }
        temp[j + 1] = key;
    }
    return steps;
};

// 3. SELECTION SORT
export const selectionSort = (array) => {
    const steps = [];
    let temp = [...array];
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < temp.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < temp.length; j++) {
            comparisons++;
            steps.push({
                array: [...temp],
                comparing: [j, minIdx],
                swapping: [],
                comparisons,
                swaps,
                status: "COMPARING"
            });

            if (temp[j] < temp[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            swaps++;
            [temp[i], temp[minIdx]] = [temp[minIdx], temp[i]];
            steps.push({
                array: [...temp],
                comparing: [],
                swapping: [i, minIdx],
                comparisons,
                swaps,
                status: "SWAPPING"
            });
        }
    }
    return steps;
};

// 4. QUICK SORT (Lomuto Partition Scheme)
export const quickSort = (array) => {
    const steps = [];
    let temp = [...array];
    let comparisons = 0;
    let swaps = 0;

    const runQuickSort = (arr, low, high) => {
        if (low < high) {
            let pIdx = partition(arr, low, high);
            runQuickSort(arr, low, pIdx - 1);
            runQuickSort(arr, pIdx + 1, high);
        }
    };

    const partition = (arr, low, high) => {
        let pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            comparisons++;
            steps.push({
                array: [...arr],
                comparing: [j, high],
                swapping: [],
                comparisons,
                swaps,
                status: "COMPARING"
            });

            if (arr[j] < pivot) {
                i++;
                swaps++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                steps.push({
                    array: [...arr],
                    comparing: [],
                    swapping: [i, j],
                    comparisons,
                    swaps,
                    status: "SWAPPING"
                });
            }
        }
        swaps++;
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        steps.push({
            array: [...arr],
            comparing: [],
            swapping: [i + 1, high],
            comparisons,
            swaps,
            status: "SWAPPING"
        });
        return i + 1;
    };

    runQuickSort(temp, 0, temp.length - 1);
    return steps;
};

// 5. MERGE SORT
export const mergeSort = (array) => {
    const steps = [];
    let temp = [...array];
    let comparisons = 0;
    let swaps = 0; // Tracks writes back to target source locations

    const runMergeSort = (arr, start, end) => {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        runMergeSort(arr, start, mid);
        runMergeSort(arr, mid + 1, end);
        merge(arr, start, mid, end);
    };

    const merge = (arr, start, mid, end) => {
        let leftArr = arr.slice(start, mid + 1);
        let rightArr = arr.slice(mid + 1, end + 1);
        let i = 0, j = 0, k = start;

        while (i < leftArr.length && j < rightArr.length) {
            comparisons++;
            steps.push({
                array: [...arr],
                comparing: [start + i, mid + 1 + j],
                swapping: [],
                comparisons,
                swaps,
                status: "COMPARING"
            });

            if (leftArr[i] <= rightArr[j]) {
                swaps++;
                arr[k] = leftArr[i];
                i++;
            } else {
                swaps++;
                arr[k] = rightArr[j];
                j++;
            }
            steps.push({
                array: [...arr],
                comparing: [],
                swapping: [k],
                comparisons,
                swaps,
                status: "SWAPPING"
            });
            k++;
        }

        while (i < leftArr.length) {
            swaps++;
            arr[k] = leftArr[i];
            steps.push({ array: [...arr], comparing: [], swapping: [k], comparisons, swaps, status: "SWAPPING" });
            i++; k++;
        }
        while (j < rightArr.length) {
            swaps++;
            arr[k] = rightArr[j];
            steps.push({ array: [...arr], comparing: [], swapping: [k], comparisons, swaps, status: "SWAPPING" });
            j++; k++;
        }
    };

    runMergeSort(temp, 0, temp.length - 1);
    return steps;
};

// 6. HEAP SORT
export const heapSort = (array) => {
    const steps = [];
    let temp = [...array];
    let comparisons = 0;
    let swaps = 0;

    const heapify = (arr, n, i) => {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;

        if (left < n) {
            comparisons++;
            if (arr[left] > arr[largest]) largest = left;
        }
        if (right < n) {
            comparisons++;
            if (arr[right] > arr[largest]) largest = right;
        }

        if (largest !== i) {
            swaps++;
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            steps.push({
                array: [...arr],
                comparing: [i, largest],
                swapping: [i, largest],
                comparisons,
                swaps,
                status: "SWAPPING"
            });
            heapify(arr, n, largest);
        }
    };

    for (let i = Math.floor(temp.length / 2) - 1; i >= 0; i--) {
        heapify(temp, temp.length, i);
    }

    for (let i = temp.length - 1; i > 0; i--) {
        swaps++;
        [temp[0], temp[i]] = [temp[i], temp[0]];
        steps.push({
            array: [...temp],
            comparing: [],
            swapping: [0, i],
            comparisons,
            swaps,
            status: "SWAPPING"
        });
        heapify(temp, i, 0);
    }
    return steps;
};

// 7. RADIX SORT (LSD Approach)
export const radixSort = (array) => {
    const steps = [];
    let temp = [...array];
    let comparisons = 0;
    let swaps = 0;

    const max = Math.max(...temp);

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        let output = new Array(temp.length).fill(0);
        let count = new Array(10).fill(0);

        for (let i = 0; i < temp.length; i++) {
            count[Math.floor(temp[i] / exp) % 10]++;
        }

        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        for (let i = temp.length - 1; i >= 0; i--) {
            let digit = Math.floor(temp[i] / exp) % 10;
            output[count[digit] - 1] = temp[i];
            count[digit]--;
        }

        for (let i = 0; i < temp.length; i++) {
            swaps++;
            temp[i] = output[i];
            steps.push({
                array: [...temp],
                comparing: [i],
                swapping: [i],
                comparisons,
                swaps,
                status: "SWAPPING"
            });
        }
    }
    return steps;
};

// 8. BUCKET SORT
export const bucketSort = (array) => {
    const steps = [];
    let temp = [...array];
    let comparisons = 0;
    let swaps = 0;

    if (temp.length === 0) return steps;

    let min = Math.min(...temp);
    let max = Math.max(...temp);
    let bucketCount = Math.floor(Math.sqrt(temp.length)) || 1;
    let buckets = Array.from({ length: bucketCount }, () => []);

    for (let i = 0; i < temp.length; i++) {
        let bucketIndex = Math.floor(((temp[i] - min) / (max - min || 1)) * (bucketCount - 1));
        buckets[bucketIndex].push(temp[i]);
    }

    let arrIdx = 0;
    for (let b = 0; b < buckets.length; b++) {
        // Quick insertion inline sort pass on individual buckets
        let bucket = buckets[b];
        for (let i = 1; i < bucket.length; i++) {
            let key = bucket[i];
            let j = i - 1;
            while (j >= 0 && bucket[j] > key) {
                comparisons++;
                bucket[j + 1] = bucket[j];
                j--;
            }
            bucket[j + 1] = key;
        }

        // Reconstruct steps mapping directly onto array updates
        for (let i = 0; i < bucket.length; i++) {
            swaps++;
            temp[arrIdx] = bucket[i];
            steps.push({
                array: [...temp],
                comparing: [arrIdx],
                swapping: [arrIdx],
                comparisons,
                swaps,
                status: "SWAPPING"
            });
            arrIdx++;
        }
    }
    return steps;
};