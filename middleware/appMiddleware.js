const appMiddleware = (req,res,next)=>{
    // logic
    console.log("Inside Application middleware");
    next()
}

module.exports = appMiddleware