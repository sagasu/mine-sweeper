document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let bombAmount = 20;
    let isGameOver = false;
    let width = 10;
    let squares = [];
    let flags = 0;
    
    function createBoard() {
        const bombsArray = Array(bombAmount).fill('bomb');
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
                if(i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb'))
                    total += 1;

                if(i > 9 && !isRightEdge && squares[i +1 - width].classList.contains('bomb'))
                    total += 1;

                if(i > 10 && squares[i - width].classList.contains('bomb'))
                    total += 1;

                if(i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb'))
                    total += 1;
                    
                if(i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb'))
                    total += 1;
                
                if(i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb'))
                    total += 1;

                if(i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb'))
                    total += 1;

                if(i < 89 && squares[i + width].classList.contains('bomb'))
                    total += 1;
                squares[i].setAttribute('data', total);

            }
        }
    }
    createBoard();

    function addFlag(square){
        if(isGameOver) return;

        if(!square.classList.contains('checked') && (flags < bombAmount)){
            if(!square.classList.contains('flag')){
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags += 1;
            }else{
                square.classList.remove('flag');
                square.innerHTML = '';
                flags -= 1;
            }
        }
    }

    function gameOver(square){
        isGameOver = true;
        squares.forEach(square => {
            if(square.classList.contains('bomb')) {
                square.innerHTML = '💣';
            }
        })
    }
    
    function click(square){
        let currentId = square.id;
        if (isGameOver) return;
    
        if (square.classList.contains('checked') || square.classList.contains('flag'))
            return;
    
        if (square.classList.contains('bomb')){
            gameOver(square)
        } else {
            let total = square.getAttribute('data');
            if (total != 0){
                square.classList.add('checked');
                square.innerHTML = total;
                return;
            }
            checkSquare(square, currentId);
        }
        square.classList.add('checked');
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





