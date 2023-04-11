import Tetrimino from "./Tetrimino"

export default class O_Piece extends Tetrimino{

    constructor(){
        super()
        this.color = 3
        this.rotate = rotateNum => {
            switch(rotateNum){
                case 0: 
                    this.body = [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[1, 0], [1, 1]]
                    this.rightMost = [[2, 0], [2, 1]]
                    this.bottomMost = [[1, 1], [2, 1]]
                    break;
                case 1:
                    this.body = [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[1, 0], [1, 1]]
                    this.rightMost = [[2, 0], [2, 1]]
                    this.bottomMost = [[1, 1], [2, 1]]
                    break;
                case 2:
                    this.body = [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[1, 0], [1, 1]]
                    this.rightMost = [[2, 0], [2, 1]]
                    this.bottomMost = [[1, 1], [2, 1]]
                    break;
                case 3:
                    this.body = [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[1, 0], [1, 1]]
                    this.rightMost = [[2, 0], [2, 1]]
                    this.bottomMost = [[1, 1], [2, 1]]
                    break;
            }
        }
    }
}