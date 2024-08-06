require('dotenv').config()
const axios = require('axios')

async function checkEmailDomain(req, res, next){
    try {
        const email = req.body.info.email 
        const data = await axios.get(`https://mailcheck.p.rapidapi.com/?domain=${email}`, {
            "headers": {
                "x-rapidapi-key": process.env.REACT_APP_X_RAPID_API_KEY,
                "x-rapidapi-host": process.env.REACT_APP_X_RAPID_API_HOST
            }
        });
        if (data.data.risk <= 10 && data.data.valid) {
            next()
        } else {
            throw {error: `${data.data.text}, ${data.data.reason}` }
        }
    } catch (error) {
        console.log(error)
        return res.send( error );

    }
}

module.exports = checkEmailDomain