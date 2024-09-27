const isAdmin = (req, res, next)=>{
    if(req.role !== 'admin'){
        return res.status(403).send({success: false, message: 'Access denied! You must be an admin.'});
    } else{
        next();
    }
}

module.exports = isAdmin;