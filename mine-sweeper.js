document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let width = 10;
    let squares = [];
    let bombAmount = 20;
    

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
            })
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
});

let isGameOver = false;

function click(square){
    let currentId = square.id;
    if (isGameOver) return;

    if (square.classList.contains('checked') || square.classList.contains('flag'))
        return;

    if (square.classList.contains('bomb')){
        isGameOver = true;
        alert('game over');
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

    setTimeout(() => {
        if(currentId > 0 && !isLeftEdge){
            const newId = squares[parseInt(currentId) - 1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }

        if(currentId > 9 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1 - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if(currentId > 10){
            
        }

    }, 10)
}