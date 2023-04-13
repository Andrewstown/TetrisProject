import Tetrimino from "./Tetrimino"

export default class S_Piece extends Tetrimino{

    constructor(){
        super()
        this.look = [[0, 1, 1], [1, 1, 0]]
        this.color = 4
        this.rotate = rotateNum => {
            switch(rotateNum){
                case 0:
                    this.body = [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[1, 0], [0, 1]]
                    this.rightMost = [[2, 0], [1, 1]]
                    this.bottomMost = [[0, 1], [1, 1], [2, 0]]
                    break;
                case 1:
                    this.body = [[0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[1, 0], [1, 1], [2, 2]]
                    this.rightMost = [[1, 0], [2, 1], [2, 2]]
                    this.bottomMost = [[1, 1], [2, 2]]
                    break;
                case 2:
                    this.body = [[0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[1, 1], [0, 2]]
                    this.rightMost = [[2, 1], [1, 2]]
                    this.bottomMost = [[0, 2], [1, 2], [2, 1]]
                    break;
                case 3:
                    this.body = [[1, 0, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[0, 0], [0, 1], [1, 2]]
                    this.rightMost = [[0, 0], [1, 1], [1, 2]]
                    this.bottomMost = [[0, 1], [1, 2]]
                    break;
            }
        }
    }
}