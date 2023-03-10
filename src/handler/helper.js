import dayjs from "dayjs";

const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// function for generate array of integer with random value from min to max
// it's prioritized to generate array with unique value
const generateRandomArray = (min, max, num) => {
    const arr = [];
    while (arr.length < num) {
        const random = randomIntFromInterval(min, max);
        if (arr.indexOf(random) === -1) {
            arr.push(random);
        }
    }
    return arr;
}

const randomDate = (start, end) => {
    const date = dayjs(start).add(randomIntFromInterval(0, dayjs(end).diff(start, 'day')), 'day');
    return date;
}

export default {
    randomIntFromInterval,
    generateRandomArray,
    randomDate
}