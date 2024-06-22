// first programm
let arr = ["d", 2, 3, 4, 5, 6, 7];
let arr1 = [1, 2, 3, 4, 5, 6, 7];

function sumArrayPromise(arr) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(arr) || !arr.every(num => typeof num === 'number')) {
      return reject(new Error('Invalid input: you have to enter an array of numbers.'));
    } else {
      setTimeout(() => {
        const result = arr;
        resolve(result);
      }, 3000);
    }
  });
}

sumArrayPromise(arr)
  .then(result => console.log('result:', result), error => console.error('Error:', error.message));

sumArrayPromise(arr1)
  .then(result => console.log('result:', result), error => console.error('Error:', error.message));


//second programm

function concurrentPromises(promises, maxExecuting) {

  const results = [];
  let currentlyExecutingPromises = 0;
  let currentIndex = 0;
  let resolveAll;

  const promiseExecutor = () => {
    if (currentIndex >= promises.length) {
      if (currentlyExecutingPromises === 0) {
        resolveAll(results);
      }
      return;
    }

    const promiseIndex = currentIndex++;
    currentlyExecutingPromises++;

    Promise.resolve(promises[promiseIndex]())
      .then(result => {
        results[promiseIndex] = result;
      })
      .finally(() => {
        currentlyExecutingPromises--;
        promiseExecutor();
      });
  };

  return new Promise((resolve, reject) => {
    resolveAll = resolve;
    rejectAll = reject;

    for (let i = 0; i < maxExecuting && i < promises.length; i++) {
      promiseExecutor();
    }
  });
}

const createPromise = (value) => () => Promise.resolve(value);

const arrOfPromises = [
  createPromise('promise 1 result'),
  createPromise('promise 2 result'),
  createPromise('promise 3 result'),
  createPromise('promise 4 result'),
  createPromise('promise 5 result')
];

concurrentPromises(arrOfPromises, 2).then((results) => {
  console.log(results);
})

//third programm 
function sequenceAsync(promiseFunctions) {
  return promiseFunctions.reduce((prevPromise, currentFunction) => {
    return prevPromise.then(currentFunction);
  },
    Promise.resolve());
}


const promiseFunc1 = (prevResult) => {
  console.log(`promiseFunc1 recieved: ${prevResult}`);
  return Promise.resolve('result 1');
};

const promiseFunc2 = (prevResult) => {
  console.log(`promiseFunc2 recieved: ${prevResult}`);
  return Promise.resolve('result 2');
};

const promiseFunc3 = (prevResult) => {
  console.log(`promiseFunc3 recieved: ${prevResult}`);
  return Promise.resolve('result 3');
};

const promiseFunctions = [promiseFunc1, promiseFunc2, promiseFunc3];

sequenceAsync(promiseFunctions).then((finalResult) => {
  console.log(`Final result: ${finalResult}`);
});