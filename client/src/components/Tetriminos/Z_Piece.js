import Tetrimino from "./Tetrimino"

export default class Z_Piece extends Tetrimino{

    constructor(){
        super()
        this.look = [[1, 1, 0], [0, 1, 1]]
        this.color = 1
        this.rotate = rotateNum => {
            switch(rotateNum){
                case 0:
                    this.body = [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[0, 0], [1, 1]]
                    this.rightMost = [[1, 0], [2, 1]]
                    this.bottomMost = [[0, 0], [1, 1], [2, 1]]
                    break;
                case 1:
                    this.body = [[0, 0, 1, 0], [0, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[2, 0], [1, 1], [1, 2]]
                    this.rightMost = [[2, 0], [2, 1], [1, 2]]
                    this.bottomMost = [[1, 2], [2, 1]]
                    break;
                case 2: 
                    this.body = [[0, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[0, 1], [1, 2]]
                    this.rightMost = [[1, 1], [2, 2]]
                    this.bottomMost = [[0, 1], [1, 2], [2, 2]]
                    break;
                case 3:
                    this.body = [[0, 1, 0, 0], [1, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[1, 0], [0, 1], [0, 2]]
                    this.rightMost = [[1, 0], [1, 1], [0, 2]]
                    this.bottomMost = [[0, 2], [1, 1]]
                    break;
            }
        }
    }
}