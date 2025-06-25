let array = [];
let delay = 100;
const container = document.getElementById("bars-container");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function drawBars(active = [], sorted = []) {
  container.innerHTML = "";
  array.forEach((val, i) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${val}px`;
    if (active.includes(i)) bar.classList.add("active");
    if (sorted.includes(i)) bar.classList.add("sorted");
    container.appendChild(bar);
  });
}

function generateArray() {
  const size = parseInt(document.getElementById("size").value || 50);
  array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 300 + 10));
  }
  drawBars();
}

async function bubbleSort() {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      drawBars([j, j + 1]);
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
      await sleep(delay);
    }
  }
  drawBars([], [...Array(array.length).keys()]);
}

async function selectionSort() {
  for (let i = 0; i < array.length; i++) {
    let min = i;
    for (let j = i + 1; j < array.length; j++) {
      drawBars([min, j]);
      if (array[j] < array[min]) min = j;
      await sleep(delay);
    }
    [array[i], array[min]] = [array[min], array[i]];
  }
  drawBars([], [...Array(array.length).keys()]);
}

async function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
      drawBars([j, j + 1]);
      await sleep(delay);
    }
    array[j + 1] = key;
  }
  drawBars([], [...Array(array.length).keys()]);
}

async function mergeSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  const left = array.slice(start, mid + 1);
  const right = array.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;
  while (i < left.length && j < right.length) {
    drawBars([k]);
    if (left[i] <= right[j]) {
      array[k++] = left[i++];
    } else {
      array[k++] = right[j++];
    }
    await sleep(delay);
  }
  while (i < left.length) {
    array[k++] = left[i++];
    await sleep(delay);
  }
  while (j < right.length) {
    array[k++] = right[j++];
    await sleep(delay);
  }
}

async function quickSort(low = 0, high = array.length - 1) {
  if (low < high) {
    const pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    drawBars([j, high]);
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      await sleep(delay);
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  await sleep(delay);
  return i + 1;
}

async function startSort() {
  const algo = document.getElementById("algorithm").value;
  const speed = parseFloat(document.getElementById("speed").value || 1);
  delay = 200 / speed;

  if (algo === "bubble") await bubbleSort();
  else if (algo === "selection") await selectionSort();
  else if (algo === "insertion") await insertionSort();
  else if (algo === "merge") await mergeSort();
  else if (algo === "quick") await quickSort();

  drawBars([], [...Array(array.length).keys()]);
}

generateArray();
