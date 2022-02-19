import BLOCKS from "./blocks.js";

//DOM
const playground = document.querySelector(".playground > ul");

//Setting
const GAME_ROW = 20;
const GAME_COLS = 10;

//variables
let score = 0;
let duration = 500; //블록이 떨어지는 시간
let downInterval; //
let tempMovingItem;

const movingItem = { //다음 블록의 타입, 정보
    type: "zee",
    direction: 0, //방향돌리기
    top: 0, //좌표기준 어디로 내려왔는지 등
    left: 4
}

//Function
function init() {
    generateNewBlock()
    tempMovingItem = {...movingItem};
    for (let i = 0; i < GAME_ROW; i++) {
        prependNewLine()
    }
    renderBlocks()
}

function prependNewLine() {
    const li = document.createElement("li")
    const ul = document.createElement("ul")
    for (let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement("li")
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playground.prepend(li)
}

function seizeBlock() {
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    generateNewBlock()
}

function generateNewBlock(){
    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length)
     
    movingItem.type = blockArray[randomIndex][0]
    movingItem.top = 0;
    movingItem.left = 4;
    movingItem.direction = 0;
    tempMovingItem = {...movingItem}
    renderBlocks()
}

function renderBlocks(moveType="") {
    const {type, direction, top, left} = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);

        if (isAvailable) {
            target.classList.add(type, "moving");
        } else {
            tempMovingItem = {...movingItem}
            setTimeout(()=>{
                renderBlocks();
                if(moveType === "top"){
                    seizeBlock();
                }
            }, 0)
            return true;
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}

function checkEmpty(target) {
    if (!target ||target.classList.contains("seized")) {
        return false;
    }
    return true;
}

function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount
    renderBlocks(moveType)
}

function changeDirection() {
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks()
}

function downBlock(moveType) {
    let maxMove = 0;
    while(true){
        

        if(checkEmpty(target)){
            break;
        }

        maxMove++;
    }
    tempMovingItem[moveType] += maxMove;

    renderBlocks(moveType);
}

//event handling
document.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 39:
            moveBlock("left", 1)
            break;
        case 37:
            moveBlock("left", -1)
            break;
        case 40:
            moveBlock("top", 1);
            break;
        case 38:
            downBlock("top");
        case 32:
            changeDirection();
            break;
        default:
            break;
    }
})

//main
init()