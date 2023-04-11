import Tetrimino from "./Tetrimino"

export default class I_Piece extends Tetrimino{

    constructor(){
        super()
        this.color = 5
        this.rotate = rotateNum => {
            switch(rotateNum){
                case 0: 
                    this.body = [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[0, 1]]
                    this.rightMost = [[3, 1]]
                    this.bottomMost = [[0, 1], [1, 1], [2, 1], [3, 1]]
                    break;
                case 1:
                    this.body = [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0,]]
                    this.leftMost = [[2, 0], [2, 1], [2, 2], [2, 3]]
                    this.rightMost = [[2, 0], [2, 1], [2, 2], [2, 3]]
                    this.bottomMost = [[2, 3]]
                    break;
                case 2:
                    this.body = [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0,]]
                    this.leftMost = [[0, 2]]
                    this.rightMost = [[3, 2]]
                    this.bottomMost = [[0, 2], [1, 2], [2, 2], [3, 2]]
                    break;
                case 3:
                    this.body = [[0, 1, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0,]]
                    this.leftMost = [[1, 0], [1, 1], [1, 2], [1, 3]]
                    this.rightMost = [[1, 0], [1, 1], [1, 2], [1, 3]]
                    this.bottomMost = [[1, 3]]
                    break;
            }
        }
    }
}