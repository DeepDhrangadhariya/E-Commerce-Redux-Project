module.exports.verifyAdmin = (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).send({success: false, message: "You Are Not Authorized To Perform This Action"})
    }
    next()
}