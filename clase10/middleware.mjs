
//MIDDLEWARE
const MIDD1 = (req,res,next)=>{
    console.log('se ejecuto un mdd1')
    next()
}
const MIDD2 = (req,res,next)=>{
    console.log('se ejecuto un mdd2')
    next()
}
