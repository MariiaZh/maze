let maze = [
    ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '+', '+', '+', '#', '+', '+', '+', '#'],
    ['#', '+', '#', '+', '#', '+', '#', '+', '#'],
    ['+', '+', '#', '+', '0', '+', '#', '+', '#'],
    ['#', '#', '#', '+', '#', '#', '#', '#', '#'],
    ['#', '#', '+', '+', '#', '#', '#', '#', '#'],
    ['#', '#', '+', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
];

let mazeCopy = maze.map(item => item);
let table = document.querySelector("table");
let btn = document.querySelector("#show");
let ol = document.querySelector(".steps");

let start = {};
let exit = {};
let ways = [];
let correctWay = [];

let mazeWidth = mazeCopy[0].length;
let mazeHeight = mazeCopy.length;

let controlSteps = false;

class Item {
    constructor(name, side, number, index, top, bottom, left, right, id) {
        this.name = name,
            this.side = side,
            this.number = number,
            this.index = index,
            this.top = top,
            this.bottom = bottom,
            this.left = left,
            this.right = right,
            this.id = id
    }

    siblingsCount = function () {
        if (this.top + this.bottom + this.left + this.right == 2) {
            return true;
        } else {
            return false;
        }
    }
}

// step 1 detect 'start' and create array of possible steps
mazeCopy.forEach((elem, number) => {
    elem.forEach((item, index) => {
        table.rows[number].children[index].innerHTML = item;
        if (item == "+") {
            step = new Item("step", "", number, index, false, false, false, false, 0);
            ways.push(step);
        }
        if (item == "0") {
            start = new Item("start", "start", number, index, false, false, false, false, 0);
        }
    })
})

detectExit();
getStepsChain();
getWay();

window.onload = function () {
    btn.addEventListener("click", showSteps);
}

// step 2 detect 'exit'
function detectExit() {
    let pos = -1;
    for (let item of ways) {
        if (item.number == 0 || item.index == 0 ||
            item.number == mazeHeight - 1 || item.index == mazeWidth - 1) {
            item.name = "exit";
            mazeCopy[item.number][item.index] = "*";
            exit = item;
            pos = ways.indexOf(item);
        }
    }
    ways.splice(pos, 1);
}

// step 3 remove wrong steps
function getStepsChain() {
    for (let item of ways) {
        removeBlindStep(item);
        if (!item.siblingsCount()) {
            controlSteps = true;
        }
    }
    if (controlSteps) {
        controlSteps = false;
        getStepsChain();
    }
}

// step 4 build array with way from maze
function getWay() {
    getSiblings(start);
    correctWay.push(start);
    ways.push(exit);
    showNextStep(start);
};

function showNextStep(item) {

    let last = correctWay[correctWay.length - 1];

    if (item.top &&
        !(last.number == item.number - 1 && last.index == item.index)) {
        pushCorrectItem("top", item.number - 1, item.index);
    }
    if (item.bottom &&
        !(last.number == item.number + 1 && last.index == item.index)) {
        pushCorrectItem("bottom", item.number + 1, item.index);
    }
    if (item.left &&
        !(last.number == item.number && last.index == item.index - 1)) {
        pushCorrectItem("left", item.number, item.index - 1);
    }
    if (item.right &&
        !(last.number == item.number && last.index == item.index - 1)) {
        pushCorrectItem("right", item.number, item.index + 1);
    };
}

function pushCorrectItem(side, num, ind) {

    for (let elem of ways) {

        if (elem.number == num && elem.index == ind) {
            elem.side = side;
            elem.id = 1;

            correctWay.push(elem);
            ways.splice(ways.indexOf(elem), 1);

            if (ways.length > 0) {
                showNextStep(elem);
            }
            break;
        }
    }
}

function removeBlindStep(item) {

    let siblings = getSiblings(item);

    if (siblings < 2 && item.name == "step") {
        mazeCopy[item.number][item.index] = "#";
        ways.splice(ways.indexOf(item), 1);
        controlSteps = true;
    }
}

function getSiblings(item) {

    item.top = false;
    item.bottom = false;
    item.left = false;
    item.right = false;

    let counter = 0;

    if (detectSibling(mazeCopy[item.number + 1][item.index])) {
        item.bottom = true;
        counter++;
    }

    if (detectSibling(mazeCopy[item.number - 1][item.index])) {
        item.top = true;
        counter++;
    }

    if (detectSibling(mazeCopy[item.number][item.index - 1])) {
        item.left = true;
        counter++;
    }

    if (detectSibling(mazeCopy[item.number][item.index + 1])) {
        item.right = true;
        counter++;
    }

    return counter;
}

function detectSibling(mazeElemValue) {

    if (mazeElemValue == "+" || mazeElemValue == "0" || mazeElemValue == "*") {
        return true;
    } else {
        return false;
    }
}

// list creating

function showSteps() {

    let stepsArr = []
    correctWay.forEach(elem => {
        stepsArr.push(elem.side);
    })

    correctWay.forEach(elem => {
        let li = document.createElement("li");
        li.innerHTML = elem.side;
        ol.append(li);
    })

    console.log(stepsArr);

}
