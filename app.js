/*
MIT License

Copyright (c) 2020 Mark Sameh Abdalla Shenouda

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid')
	let squares = Array.from(grid.querySelectorAll('div'))
	const nextShape = document.querySelectorAll('.next-display div')
	const startBtn = document.querySelector('#start-btn')
	const scoreDisplay = document.querySelector('#score-display span')
	const linesDisplay = document.querySelector('#lines-display span')
	const width = 10
	const nextWidth = 3
	const height = 20
	let score = 0
	let lines = 0
	let currentPosition = 4
	let game = false
	let timeId

	const colors = [
		'red',
		'green',
		'blue',
		'orange',
		'yellow',
		'purple',
		'lightblue'
	]

	const errors = {
		'0-11': 1,
		'083': -1,
		'183': -1,
		'181': -1,
		'283': -1,
		'281': -1,
		'381': -1,
		'383': -1,
		'4-12': 1,
		'480': -1,
		'6-11': 1,
		'6-13': 1,
		'681': -2,
		'683': -2,
		'671': -1,
		'673': -1
	}




	const jTetromino = [
		[1, width + 1, width * 2 + 1, 2],
		[width, width + 1, width + 2, width * 2 + 2],
		[1, width + 1, width * 2 + 1, width * 2],
		[width, width * 2, width * 2 + 1, width * 2 + 2]
	  ]


	  const lTetromino = [
		[0, 1, width+1, width*2+1],
		[2, width, width+1, width+2],
		[0, width, width*2, width*2+1],
		[width, width+1, width+2, width*2]
	  ]

	
	  const sTetromino = [
		[0, width, width + 1, width * 2 + 1],
		[width + 1, width + 2, width * 2, width * 2 + 1],
		[0, width, width + 1, width * 2 + 1],
		[width + 1, width + 2, width * 2, width * 2 + 1]
	  ]

	  const zTetromino = [
		  [1, width, width+1, width*2],
		  [0, 1, width+1, width+2],
		  [1, width, width+1, width*2],
		  [0, 1, width+1, width+2]
	  ]
	
	  const tTetromino = [
		[1, width, width + 1, width + 2],
		[1, width + 1, width + 2, width * 2 + 1],
		[width, width + 1, width + 2, width * 2 + 1],
		[1, width, width + 1, width * 2 + 1]
	  ]
	
	  const oTetromino = [
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
		[0, 1, width, width + 1]
	  ]
	
	  const iTetromino = [
		[1, width + 1, width * 2 + 1, width * 3 + 1],
		[width, width + 1, width + 2, width + 3],
		[1, width + 1, width * 2 + 1, width * 3 + 1],
		[width, width + 1, width + 2, width + 3]
	  ]

	  const theTetrominoes = [jTetromino, lTetromino, sTetromino, zTetromino, tTetromino, oTetromino, iTetromino]


	  const jSmall = [1, nextWidth + 1, nextWidth * 2 + 1, 2]
	  const lSmall = [0, 1, nextWidth+1, nextWidth*2+1]	
	  const sSmall = [0, nextWidth, nextWidth + 1, nextWidth * 2 + 1]
	  const zSmall = [1, nextWidth, nextWidth+1, nextWidth*2]
	  const tSmall = [1, nextWidth, nextWidth + 1, nextWidth + 2]
	  const oSmall = [0, 1, nextWidth, nextWidth + 1]
	  const iSmall = [1, nextWidth + 1, nextWidth * 2 + 1, nextWidth * 3 + 1]
	  const smallTetrominoes = [jSmall, lSmall, sSmall, zSmall, tSmall, oSmall, iSmall]


	let random = Math.floor(Math.random() * theTetrominoes.length)
	let nextRandom = Math.floor(Math.random() * theTetrominoes.length)
	let randomColor = Math.floor(Math.random() * colors.length)
	let nextColor = Math.floor(Math.random() * colors.length)
	let currentRotation = 0
	let current = theTetrominoes[random][currentRotation]
	  
	  


	  function draw(){
		if(game){
			current.forEach( index => {
				squares[currentPosition + index].classList.add('block')
				squares[currentPosition + index].classList.add(colors[randomColor])
			})
		}
	  }

	  function undraw(){
		let blocks = document.querySelectorAll('.block')
		blocks.forEach(e => e.classList = '')
	  }

	  function moveDown(){
		undraw()
		currentPosition = currentPosition += width
		draw()
		freeze()
	  }

	  function moveRight(){
		undraw()
		const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
		if (!isAtRightEdge) currentPosition += 1
		if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
		  currentPosition -= 1
		}
		draw()
	  }

	  function moveLeft(){
		undraw()
		const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
		if (!isAtLeftEdge) currentPosition -= 1
		if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
		  currentPosition += 1
		}
		draw()
	  }


	  function rotate(){
		undraw()
		let p0 = currentPosition
		while(p0>8){
			p0 -= 10
			continue
		}
		let nextRotation = currentRotation + 1
		if (nextRotation === current.length) {
			nextRotation = 0
		  }
		let code = String(random) + String(p0) + String(nextRotation)
		if(Object.keys(errors).includes(code)){
			currentPosition += errors[code]
		}

		currentRotation++
		if (currentRotation === current.length) {
			currentRotation = 0
		}
		current = theTetrominoes[random][currentRotation]
		draw()
	  }


	  function gameOver() {
		if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
		  alert('Game Over')
		  startBtn.style.display = 'none'
		clearInterval(timerId)
		  game = false
		}
	  }


	  function addScore() {
		  for (currentIndex = 0; currentIndex < height * width; currentIndex += width) {
			let row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9]
			if (row.every(index => squares[index].classList.contains('block2'))) {
			  score += 10
			  lines += 1
			  scoreDisplay.innerHTML = score
			  linesDisplay.innerHTML = lines
			  row.forEach(index => {
				squares[index].classList.remove('block2') || squares[index].classList.remove('block')
			  })
			  //splice array
			  let squaresRemoved = squares.splice(currentIndex, width)
			  squaresRemoved.forEach(e => e.classList = '')
			  squares = squaresRemoved.concat(squares)
			  squares.forEach(cell => grid.appendChild(cell))
			}
		  }
	  }

	  

	  function freeze() {
		
		if (current.some(index => currentPosition + index > 189 || squares[currentPosition + index + width].classList.contains('block2'))) {
		  
		  current.forEach(index => {
			squares[index + currentPosition].classList.remove('block')
			squares[index + currentPosition].classList.add('block2')
		  })
		  random = nextRandom
		  nextRandom = Math.floor(Math.random() * theTetrominoes.length)
		  current = theTetrominoes[random][currentRotation]
		  randomColor = nextColor
		  nextColor = Math.floor(Math.random() * colors.length)
		  currentPosition = 4
		  draw()
		  displayShape()
	      addScore()
		  gameOver()
		}
	  }
	  freeze()


draw()


document.addEventListener('keyup', e => {
	if(game){
		switch(e.keyCode){
			case 39:
				moveRight()
				break
			case 38:
				rotate()
				break
			case 37:
				moveLeft()
				break
			case 40:
				moveDown()
				break
		}
	}
})


function displayShape() {
    nextShape.forEach(square => {
      square.classList = ''
    })
    smallTetrominoes[nextRandom].forEach(index => {
      nextShape[index].classList.add(colors[nextColor])
    })
  }


startBtn.addEventListener('mouseup', () => {
	startBtn.classList.remove('clicked')
	if(game){
		clearInterval(timerId)
		game = false
		startBtn.innerHTML = 'Resume'
	} else {
		timerId = setInterval(moveDown, 1000)
		game = true
		displayShape()
		startBtn.innerHTML = 'Pause'
	}
})

startBtn.addEventListener('mousedown', () => {
	startBtn.classList.add('clicked')
})


})