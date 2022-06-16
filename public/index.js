
var pathDelay = 10;
var IsHolding = false;
var skippedTutorial = false;



function whichBtnGoTClicked(e){

    var clickedBtn;

    if(e.which == 1) clickedBtn = "left"
    if(e.which == 2) clickedBtn = "scroll"
    if(e.which == 3) clickedBtn = "right"

    return clickedBtn

}

var spotSize = 35;
class Spot{
    constructor(row, column, state="normal"){
        this.row = row;
        this.column = column;
        this.state = state;
        this.visited = false;
        this.cameFrom = null;
        this.distance = Infinity; // thats for dijastra 

    }
}

class Grid{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.board = [];
        this.startDiv = null;
        this.endDiv = null;
        this.algorithmStarted = false;
    }

    removeAll(invalidState){

        var newBoard = [];

        for(var i = 0; i < this.height; i++){

            newBoard.push([]);

            for(var j = 0; j < this.width; j++){

                var currSpot = this.board[i][j];

                var newSpot = new Spot(i, j)
                if(currSpot.state == invalidState){
                    newBoard[i].push(newSpot);
                }else{
                    newBoard[i].push(currSpot)
                }

            }

        }

        this.board = newBoard;

    }


    getSpot(x, y){
        return this.board[y][x]
    }


    createGrid(){

        var tempBoard = []
        for(var i = 0; i < this.height; i++){

            tempBoard.push([])
            for(var j = 0; j < this.width; j++){
                tempBoard[i].push(new Spot(i, j))
            }

        }
        tempBoard[0][0].state = "start";
        grid.startDiv = [0, 0]

        tempBoard[grid.height - 1][grid.width - 1].state = "end";
        grid.endDiv = [grid.height - 1, grid.width - 1]

        this.board = tempBoard;
       this.drawGrid()


    }

    
    drawGrid(){

        var playground = document.querySelector(".playground")
        

        for(var i = 0; i < this.height; i++){

            var rowOfBlocks = document.createElement("div") //rowOfBlocks
            rowOfBlocks.classList.add("row")
            rowOfBlocks.classList.add("row-index-" + i)

            for(var j = 0; j < this.width; j++){

                    var spot = this.board[i][j]
                    var spotDiv = document.createElement("div")
                    spotDiv.className = `${i}-${j}`

                    spotDiv.id = spot.state

                    spotDiv.classList.add("spot")
                    spotDiv.classList.add("border")
                    spotDiv.classList.add("border-dark")


                    rowOfBlocks.appendChild(spotDiv);


                    playground.appendChild(rowOfBlocks)
                    
                    spotDiv.addEventListener("mouseup", function(event) {
                        grid.holding = false;

                    })
            
                    spotDiv.addEventListener("mousedown", function (event){

                        grid.holding = true;

                        

                        if(grid.algorithmStarted) return;
                        if(!skippedTutorial) return;

                        

                        var eventSpot = getDivSpot(this);
                        

                        var clickedButton = whichBtnGoTClicked(event);

                        var isCtrlPressed = event.ctrlKey;
                        var isAltPressed = event.altKey;

                        var clickedDiv = event.target;

                        if(clickedButton == "left"){



                        if(clickedDiv.id == "normal"){


                            if(isCtrlPressed){

                                if(document.getElementById("start") != null){

                                    getDivSpot(document.getElementById("start")).state = "normal";


                                }
                                grid.startDiv = this.classList[0].split("-").reverse().map(x => parseInt(x))
                                clickedDiv.id = "start"
                                eventSpot.state = "start"

                            }

                            else if(isAltPressed){

                                if(document.getElementById("end") != null){
                                    getDivSpot(document.getElementById("end")).state = "normal";
                                    document.getElementById("end").id = "normal";


                                }
                                clickedDiv.id = "end"
                                eventSpot.state = "end"
                                grid.endDiv = this.classList[0].split("-").map(x => parseInt(x))
                                grid.endRealDiv = this



                            }
                            else{

                        clickedDiv.id = "wall";
                        eventSpot.state = "wall"

                            }
                            
                        }

                    }
                    
                    if(clickedButton == "right"){

                        if(eventSpot.state == "end"){
                            grid.endDiv = null
                            grid.endRealDiv = null
                        }

                        if(eventSpot.state == "start"){
                            grid.startDiv = null;
                        }

                        clickedDiv.id = "normal"
                        eventSpot.state = "normal"

                    }


                      });
                
                    spotDiv.addEventListener("mouseover", function(event) {

                        if(grid.algorithmStarted) return;
                        if(!skippedTutorial) return;

                        

                        var eventSpot = getDivSpot(this);
                        

                        var clickedButton = whichBtnGoTClicked(event);

                        var isCtrlPressed = event.ctrlKey;
                        var isAltPressed = event.altKey;

                        var clickedDiv = event.target;

                        if(clickedButton == "left"){



                        if(clickedDiv.id == "normal"){


                            if(isCtrlPressed){

                                if(document.getElementById("start") != null){

                                    getDivSpot(document.getElementById("start")).state = "normal";


                                }
                                grid.startDiv = this.classList[0].split("-").reverse().map(x => parseInt(x))
                                clickedDiv.id = "start"
                                eventSpot.state = "start"

                            }

                            else if(isAltPressed){

                                if(document.getElementById("end") != null){
                                    getDivSpot(document.getElementById("end")).state = "normal";
                                    document.getElementById("end").id = "normal";


                                }
                                clickedDiv.id = "end"
                                eventSpot.state = "end"
                                grid.endDiv = this.classList[0].split("-").map(x => parseInt(x))
                                grid.endRealDiv = this



                            }
                            else{

                        clickedDiv.id = "wall";
                        eventSpot.state = "wall"

                            }
                            
                        }

                    }
                    
                    if(clickedButton == "right"){

                        if(eventSpot.state == "end"){
                            grid.endDiv = null
                            grid.endRealDiv = null
                        }

                        if(eventSpot.state == "start"){
                            grid.startDiv = null;
                        }

                        clickedDiv.id = "normal"
                        eventSpot.state = "normal"

                    }

                    })

               
            


            
                            
            
            }


        }
        grid.endRealDiv = document.getElementById("end");


        setInterval(() => {
            this.updateSpots();
        }, 500);

        
    }


    updateSpots(){



        for(var i = 0; i < this.height; i++){

            var row = document.querySelector(".row-index-" + i)

            for(var j = 0; j < row.childNodes.length; j++){

                row.childNodes[j].id = grid.board[i][j].state 


            }


            
            }

    }


}

function getDivSpot(div){
    var boardPos = div.classList[0].split("-");
    return grid.board[boardPos[0]][boardPos[1]]

}

function getSpotDiv(spot){
        row = spot.row;
        column = spot.column

        return document.querySelector(".row-index-" + row).childNodes[spot.column]
}

function startDFS(){

    grid.algorithmStarted = true;

    var foundEnd = false;

    var visitedPath = []
    var queue = [grid.startDiv]

    while(!foundEnd && queue.length){

        const directions = [
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0],
            ]

            var [x, y] = queue.pop();

            visitedPath.push([x, y])

            for(var d = 0; d < 4; d++){
                
                var dx = directions[d][0] + x;
                var dy = directions[d][1] + y;

                if (dx < 0 || dy < 0) continue;

                if(dx >= grid.width || dy >= grid.height) continue;
                var neighborSpot = grid.getSpot(dx, dy)
                if(neighborSpot.state == "wall") continue;
                if(!neighborSpot.visited){

                    queue.push([dx, dy]) // we add the neighbor cords to the start of the queue
                    neighborSpot.visited = true;
                    neighborSpot.cameFrom = grid.getSpot(x, y);



                if(neighborSpot.state == "end"){
                    neighborSpot.cameFrom = grid.getSpot(x, y);

                    foundEnd = true;
                    break;
                }

            }
        
            }

        }

    var timeItsGoingToTake = visitedPath.length * pathDelay;

    visitedPath.forEach((curr, i) => {


                setTimeout(() => {

                    var currSpot = grid.getSpot(curr[0], curr[1])
                    if(currSpot.state == "normal"){
                    currSpot.state = "colored";
                    }

                
                }, i * pathDelay)

    })

    setTimeout(() => {

        const end = getDivSpot(grid.endRealDiv)
        let next = end.cameFrom;
        if(next == null) return;
        let limit = 60;

        let task = setInterval(() => {
          if (limit < 0) {
            return clearInterval(task);
          }
          if(next.state != "start"){
          next.state = 'path';
          next = next.cameFrom;
          }
        }, 30);


}, timeItsGoingToTake)

algorithmStarted = false;
}




function startBFS(){

    grid.algorithmStarted= true;

    var foundEnd = false;

    var visitedPath = []
    var queue = [grid.startDiv]

    while(!foundEnd && queue.length){
        const directions = [
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0],
            ]

            var [x, y] = queue.pop();

            visitedPath.push([x, y])

            for(var d = 0; d < 4; d++){
                
                var dx = directions[d][0] + x;
                var dy = directions[d][1] + y;

                if (dx < 0 || dy < 0) continue;

                if(dx >= grid.width || dy >= grid.height) continue;
                var neighborSpot = grid.getSpot(dx, dy)
                if(neighborSpot.state == "wall") continue;
                if(!neighborSpot.visited){

                    queue.unshift([dx, dy]) // we add the neighbor cords to the start of the queue
                    neighborSpot.visited = true;
                    neighborSpot.cameFrom = grid.getSpot(x, y);



                if(neighborSpot.state == "end"){
                    neighborSpot.cameFrom = grid.getSpot(x, y);

                    foundEnd = true;
                    break;
                }


            }
        
        
            }


        

        }

    var timeItsGoingToTake = visitedPath.length * pathDelay;

    visitedPath.forEach((curr, i) => {


                setTimeout(() => {

                    var currSpot = grid.getSpot(curr[0], curr[1])
                    if(currSpot.state == "normal"){
                    currSpot.state = "colored";
                    }

                
                }, i * pathDelay)

    })

    setTimeout(() => {

        const end = getDivSpot(grid.endRealDiv)
        let next = end.cameFrom;
        if(next == null) return;
        let limit = 60;

        let task = setInterval(() => {
          if (limit < 0) {
            return clearInterval(task);
          }
          if(next.state != "start"){
          next.state = 'path';
          next = next.cameFrom;
          }
        }, 100);


}, timeItsGoingToTake)

algorithmStarted = false;


}

function resetPath(){
    document.querySelector(".playground").innerHTML = "";

    grid = new Grid(gridWidth, gridHeight);
    grid.createGrid();

}

document.addEventListener('contextmenu', function(e) {
        
    e.preventDefault();

    }, false);


console.log($(window).width())
var gridWidth = Math.floor($(window).width() / (spotSize+10));
var gridHeight = Math.floor($(window).height() / (spotSize+10));

console.log(gridWidth)
var grid = new Grid(gridWidth, gridHeight);
 grid.createGrid()





 //Tutorial


 var pageCounter = 1;

 var tutorialDiv = document.getElementById("tutorial")

var  pages = {

    1: {
        title: "Welcome to my Pathfinding Visualizer Project!",
        desc1: "This tutorial will explain you everything you need to do in order to use this website.",
        desc2: 'If you want to skip the tutorial, you can click on the "Skip Tutorial", Otherwise click on "Next"'
    },

    2: {
        title: "What is this website?",
        desc1: "",
        desc2: "In this website you will be able to play with the most used pathfinding algorithms, and understand what they do."
    },

    3: {
        title: "How to use this website.",
        desc1: "In order to start using this website, we will go through a quick explanation of how to use the website.",
        desc2: 'Now, on each page, I will be explaining you every thing you need to know one by one'
    },

    4: {
        title: "The Wall Block",
        desc1: 'The wall block is a way to say to the algorithm "please avoid any of these blocks, and do not consider them as the path."',
        desc2: 'In order to place the wall block, please click on one of the blank spots.',

    },

    5: {
        title: "The Start",
        desc1: 'In order to start the algorithm, the algorithm needs to know where the path should start at.',
        desc2: 'In order to place the start, please hold the CTRL key and click on one of the blank spots.',

    },

    6: {
        title: "The End",
        desc1: 'In order to start the algorithm, the algorithm needs to know where the path should end at.',
        desc2: 'In order to place the end, please  hold the ALT key and click on one of the blank spots.',

    },

    7: {
        title: "Deleting Blocks",
        desc1: 'Deleting any of the block you placed',
        desc2: 'In order to delete blocks, click on the right click button on the block you want to delete',

    },

    8: {
        title: "Starting the algorithm",
        desc1: "",
        desc2: 'In order to start the algorithm, click on the green Start button, and then choose what algorithm you want to use.',
    },
}

const maxPages = 8;


 function updateTutorial(){
     
    var [_ , title, __, desc, ___,  desc2, ____, count, ____, img, __________, _____, ______, _______, ________, _________] = tutorialDiv.childNodes;
    console.log(tutorialDiv.childNodes, pageCounter)

    title.innerHTML = pages[pageCounter].title;

    desc.innerHTML = pages[pageCounter].desc1;

    desc2.innerHTML = pages[pageCounter].desc2;

    count.innerHTML = `${pageCounter}/${maxPages}`
    
    if("img" in pages[pageCounter]){
        img.src = "images/" + pages[pageCounter].img;
    }

 }

 function nextTab(){
     if(pageCounter < maxPages){
     pageCounter++;
     }else{
         SkipTutorial();
     }
     updateTutorial();
 }
 
 function previousTab(){
     if(pageCounter > 1){
     pageCounter--;
     }
     updateTutorial();
 }
 
 function startTutorial(){
    skippedTutorial = false;
    tutorialDiv.hidden = false;
    document.querySelector(".dropdown-toggle").hidden = true;
    pageCounter = 1;
    updateTutorial();
 }
 function SkipTutorial(){
    skippedTutorial = true;
    tutorialDiv.hidden = true;
    document.querySelector(".dropdown-toggle").hidden = false;
 
 }

 updateTutorial();
 
 
     
     



