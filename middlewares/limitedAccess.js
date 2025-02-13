function limitedAccess() {
    return function(req, res, next) {
        //Admin has access to all paths and ids, but other users should only be able to access certain details about themselves
        const {id} = req.params;
        if(!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        if (req.user.role === "admin") {
            return next();
        } 
        if(req.user && req.user.userid == id){
        return next();
        }
        // otherwise, the user is not allowed to access the resource
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    };
}

module.exports = {
    limitedAccess,
}