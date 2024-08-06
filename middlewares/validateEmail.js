// function validateEmail(email) {
function validateEmail(req, res, next) {
    const emailList = req.body.to
    console.log(req.body)
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    for(let i = 0; i < emailList.length; i++){
        const email = emailList[i]
        if(email.trim() == ''){
            res.send({error: email +  "invalid emailList format"})
        }
        const result = re.test(String(email).toLowerCase());
        if(!result) {
            res.send({error: "invalid email format"})

        }
    }

    next()
}
module.exports = validateEmail