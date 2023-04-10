import Class1 from "./Class1"

export default class childClass1 extends Class1{

    constructor(){
        super()
        this.rotation = 2
        this.soft = 1
    }

    rat(){
        console.log("RAT")
    }
}