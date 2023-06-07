const { signup, signin } = require("../../Controller/auth.controller");
const db = require("../../Model/index");
const { mockReq, mockRes } = require("../intercepter");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let token = 'token'
let user = {
    firstName: "omkar",
    lastName: "sonawane",
    email: "omkar@gmail.com",
    phone: 7841935494,
    password: "Omkar@1234",
    type: "email"
}



describe('signup', () => {

    it('should signup User', async () => {
        let req = mockReq()
        let res = mockRes()
        req.body = user

        let spyCreate = jest.spyOn(db.user, 'create').mockImplementation(() => Promise.resolve(user))

        await signup(req, res)

        expect(spyCreate).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith('Account Created Successfully')


    });

    it('should throw Error', async () => {

        let req = mockReq()
        let res = mockRes()

        let spyCreate = jest.spyOn(db.user, 'create').mockImplementation(() => { throw new Error('internal Error') })

        await signup(req, res)

        expect(spyCreate).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith('internal Error')
    })

})

describe('signin', () => {

    it('should signin as email', async () => {
        let req = mockReq()
        let res = mockRes()
        req.body = user

        let spyFindOne = jest.spyOn(db.user, 'findOne').mockImplementation(() => Promise.resolve(user))

        let spyBcrypt = jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true))

        let spyJwtSign = jest.spyOn(jwt, 'sign').mockReturnValue(token)



        await signin(req, res)

        expect(spyFindOne).toHaveBeenCalled()
        expect(spyBcrypt).toHaveBeenCalled()
        expect(spyJwtSign).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ user, token })

    });
    it('should signin as phone', async () => {
        let req = mockReq()
        let res = mockRes()
        user.type = 'phone'
        req.body = user

        let spyFindOne = jest.spyOn(db.user, 'findOne').mockImplementation(() => Promise.resolve(user))

        let spyBcrypt = jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true))

        let spyJwtSign = jest.spyOn(jwt, 'sign').mockReturnValue(token)

        await signin(req, res)

        expect(spyFindOne).toHaveBeenCalled()
        expect(spyBcrypt).toHaveBeenCalled()
        expect(spyJwtSign).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ user, token })

    });
    it('should not signin due to user not found', async () => {
        let req = mockReq()
        let res = mockRes()
        user.type = 'phone'
        req.body = user

        let spyFindOne = jest.spyOn(db.user, 'findOne').mockImplementation(() => Promise.resolve(null))

        await signin(req, res)

        expect(spyFindOne).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith('User not Found')

    });
    it('should not signin due to password incorrect', async () => {

        let req = mockReq()
        let res = mockRes()
        user.type = 'phone'
        req.body = user

        let spyFindOne = jest.spyOn(db.user, 'findOne').mockImplementation(() => Promise.resolve(user))

        let spyBcrypt = jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false))

        await signin(req, res)

        expect(spyFindOne).toHaveBeenCalled()
        expect(spyBcrypt).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith('Password is Wrong')

    });
    it('should not signin due to throw error', async () => {
        let req = mockReq()
        let res = mockRes()
        user.type = 'phone'
        req.body = user

        let spyFindOne = jest.spyOn(db.user, 'findOne').mockImplementation(() => { throw new Error(err) })

        await signin(req, res)

        expect(spyFindOne).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith('internal error')

    });

})
