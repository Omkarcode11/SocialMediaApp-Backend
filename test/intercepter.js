module.exports = {
    mockReq: () => {
        let req = {}
        req.params = jest.fn().mockReturnValue(req)
        req.body = jest.fn().mockReturnValue(req)
        req.query = jest.fn().mockReturnValue(req)
        return req
    },
    mockRes: () => {
        let res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        res.send = jest.fn().mockReturnValue(res)
        return res
    },
    mockNext: () => {
        let next = jest.fn().mockReturnValue()
        return next
    }
}