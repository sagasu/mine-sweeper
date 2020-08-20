document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let bombAmount = 20;
    let isGameOver = false;
    let width = 10;
    let squares = [];
    let flags = 0;
    const bombLabel = 'bomb';
    const flagLabel = 'flag';
    const checkedLabel = 'checked';
    const dataLabel = 'data';
    
    class Logic{

        constructor(predicate, bombElement){
            this.predicate = predicate;
            this.bombElement = bombElement;
        }
    }

    function createBoard() {
        const bombsArray = Array(bombAmount).fill(bombLabel);
        const emptyArray = Array(width*width - bombAmount).fill('valid'); 
        
        const gameArray = emptyArray.concat(bombsArray);
        // neat trick to have array randomized with it's values
        const shuffleArray = gameArray.sort(() => Math.random() - 0.5);
        
        for(let i = 0;i < width * width;i++){
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffleArray[i]);
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener('click', (e) => {
                click(square);
            });
            square.oncontextmenu = (e) => {
                e.preventDefault();
                addFlag(square);
            };
        }

        for(let i = 0; i < squares.length;i++){
            let total = 0;
            const isLeftEdge = (i%width) === 0;
            const isRightEdge = (i%width) === width - 1;

            if(squares[i].classList.contains('valid')){
                const logic = [
                    new Logic(i > 0 && !isLeftEdge, squares[i -1]),
                    new Logic(i > 9 && !isRightEdge, squares[i +1 - width]),
                    new Logic(i > 10, squares[i - width]),
                    new Logic(i > 11 && !isLeftEdge, squares[i - 1 - width]),
                    new Logic(i < 98 && !isRightEdge, squares[i + 1]),
                    new Logic(i < 90 && !isLeftEdge, squares[i - 1 + width]),
                    new Logic(i < 88 && !isRightEdge, squares[i + 1 + width]),
                    new Logic(i < 89, squares[i + width]),
                ];

                for(var j = 0; j < logic.length; j++){
                    if(logic[j].predicate && logic[j].bombElement.classList.contains(bombLabel))
                        total += 1;
                }

                squares[i].setAttribute(dataLabel, total);

            }
        }
    }
    createBoard();

    function addFlag(square){
        if(isGameOver) return;

        if(!square.classList.contains(checkedLabel) && (flags < bombAmount)){
            if(!square.classList.contains(flagLabel)){
                square.classList.add(flagLabel);
                square.innerHTML = '🚩';
                flags += 1;
                checkForWin();
            }else{
                square.classList.remove(flagLabel);
                square.innerHTML = '';
                flags -= 1;
            }
        }
    }

    function gameOver(square){
        isGameOver = true;
        squares.forEach(square => {
            if(square.classList.contains(bombLabel)) {
                square.innerHTML = '💣';
            }
        });
        alert('Game Over');
    }
    
    function click(square){
        let currentId = square.id;
        if (isGameOver) return;
    
        if (square.classList.contains(checkedLabel) || square.classList.contains(flagLabel))
            return;
    
        if (square.classList.contains(bombLabel)){
            gameOver(square)
        } else {
            let total = square.getAttribute(dataLabel);
            if (total != 0){
                square.classList.add(checkedLabel);
                square.innerHTML = total;
                return;
            }
            checkSquare(square, currentId);
        }
        square.classList.add(checkedLabel);
    }

    function checkForWin() {
        let matches = 0;

        for(let i = 0; i < squares.length;i++){
            if(squares[i].classList.contains(flagLabel) && squares[i].classList.contains(bombLabel))
                matches += 1;

            if(matches === bombAmount){
                isGameOver = true;
                alert('You won!');
            }

        }
    }
    
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width -1);
    
        var callClick = (modifier) => {
            const newId = squares[parseInt(currentId) + modifier].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
    
        setTimeout(() => {
            if(currentId > 0 && !isLeftEdge){
                callClick(-1);
            }
    
            if(currentId > 9 && !isRightEdge) {
                callClick(1 - width);
            }
            if(currentId > 10){
                callClick(-width);
            }
            if(currentId > 11 && !isLeftEdge){
                callClick(-1-width);
            }
            if(currentId > 11 && !isLeftEdge){
                callClick(-1-width);
            }
            if(currentId < 98 && !isRightEdge){
                callClick(+1);
            }
            if(currentId < 90 && !isLeftEdge){
                callClick(-1 + width);
            }
            if(currentId < 88 && !isRightEdge){
                callClick(+1 + width);
            }
            if(currentId < 89){
                callClick(width);
            }
        }, 10)
    }
});





