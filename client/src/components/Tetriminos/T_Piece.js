import Tetrimino from "./Tetrimino"

export default class T_Piece extends Tetrimino{

    constructor(){
        super()
        this.look = [[0, 1, 0], [1, 1, 1]]
        this.color = 7
        this.rotate = rotateNum => {
            switch(rotateNum){
                case 0: 
                    this.body = [[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[1, 0], [0, 1]]
                    this.rightMost = [[1, 0], [2, 1]]
                    this.bottomMost = [[0, 1], [1, 1], [2, 1]]
                    break;
                case 1:
                    this.body = [[0, 1, 0, 0], [0, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[1, 0], [1, 1], [1, 2]]
                    this.rightMost = [[1, 0], [2, 1], [1, 2]]
                    this.bottomMost = [[2, 1], [1, 2]]
                    break;
                case 2:
                    this.body = [[0, 0, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[0, 1], [1, 2]]
                    this.rightMost = [[2, 1], [1, 2]]
                    this.bottomMost = [[0, 1], [1, 2], [2, 1]]
                    break;
                case 3:
                    this.body = [[0, 1, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[1, 0], [0, 1], [1, 2]]
                    this.rightMost = [[1, 0], [1, 1], [1, 2]]
                    this.bottomMost = [[0, 1], [1, 2]]
                    break;
            }
        }
    }
}