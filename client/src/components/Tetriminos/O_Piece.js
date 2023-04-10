import Tetrimino from "./Tetrimino"

export default class O_Piece extends Tetrimino{

    constructor(){
        super()
        this.color = 3
        this.rotation(0)
    }

    rotation(rotateNum){
        this.rotate = {
            0: () => {
                this.body = [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0,]]
                this.leftMost = [[1, 0], [1, 1]]
                this.rightMost = [[2, 0], [2, 1]]
                this.bottomMost = [[1, 1], [2, 1]]
            }
        }
        this.rotate[rotateNum]()
    }
}