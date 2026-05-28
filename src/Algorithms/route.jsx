import { linearSearch, binarySearch, jumpSearch, fibonacciSearch } from "./searching";
import { bubbleSort, insertionSort, selectionSort, quickSort, mergeSort, heapSort, radixSort, bucketSort } from "./sorting";

export const executeAlgorithm = (algoName, currentArray, targetValue = null) => {
    const dataSnapshot = [...currentArray];
    let rawTimelineSteps = [];

    switch (algoName) {
        // SEARCH ROUTERS
        case "Linear Search":
            rawTimelineSteps = linearSearch(dataSnapshot, Number(targetValue));
            break;
        case "Binary Search":
            rawTimelineSteps = binarySearch(dataSnapshot.sort((a, b) => a - b), Number(targetValue));
            break;
        case "Jump Search":
            rawTimelineSteps = jumpSearch(dataSnapshot.sort((a, b) => a - b), Number(targetValue));
            break;
        case "Fibonacci Search":
            rawTimelineSteps = fibonacciSearch(dataSnapshot.sort((a, b) => a - b), Number(targetValue));
            break;

        // === SORT ROUTERS ===
        case "Bubble Sort":
            return bubbleSort(dataSnapshot);
        case "Insertion Sort":
            return insertionSort(dataSnapshot);
        case "Selection Sort":
            return selectionSort(dataSnapshot);
        case "Quick Sort":
            return quickSort(dataSnapshot);
        case "Merge Sort":
            return mergeSort(dataSnapshot);
        case "Heap Sort":
            return heapSort(dataSnapshot);
        case "Radix Sort":
            return radixSort(dataSnapshot);
        case "Bucket Sort":
            return bucketSort(dataSnapshot);

        default:
            return [];
    }



    // Voice Engine Connection
    const isSearching = algoName.toLowerCase().includes("search");
    if (isSearching && rawTimelineSteps && rawTimelineSteps.length > 0) {
        const totalSteps = rawTimelineSteps.length;
        const finalFrame = rawTimelineSteps[totalSteps - 1];

        let matchingIndexFound = null;
        for (let step of rawTimelineSteps) {
            if (step.foundIndex !== undefined && step.foundIndex !== null) {
                matchingIndexFound = step.foundIndex;
                break;
            }
        }

        if (matchingIndexFound === null && finalFrame && finalFrame.array) {
            const parsedTarget = Number(targetValue);
            const nativeIndexMatch = finalFrame.array.indexOf(parsedTarget);
            if (nativeIndexMatch !== -1) {
                matchingIndexFound = nativeIndexMatch;
            }
        }

        if (matchingIndexFound !== null) {
            finalFrame.status = "FOUND";
            finalFrame.foundIndex = matchingIndexFound;
        } else {
            finalFrame.status = "NOT_FOUND";
        }
    }

    return rawTimelineSteps;
};