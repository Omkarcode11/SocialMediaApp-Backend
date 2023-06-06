const db = require('../../Model/index')
const { signupValidation, passwordValidation, identifyInput } = require("../../middleware/validation");
const { mockReq, mockRes, mockNext } = require("../intercepter");
const passwordValidator = require('password-validator')

let schema = new passwordValidator()

let user = {
    firstName: "omkar",
    lastName: "sonawane",
    email: "omkar@gmail.com",
    phone: 7841935494,
    password: "Omkar@1234",
}


describe('signupValidation', () => {

    it('should validate signup successfully', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        req.body = user

        let spyFindOne = jest.spyOn(db.user, 'findOne').mockImplementation(() => Promise.resolve(null))

        await signupValidation(req, res, next)

        expect(spyFindOne).toHaveBeenCalled()
        expect(next).toHaveBeenCalled()
    });
    it('should not validate due to firstName is invalid', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        let obj = Object.assign({}, user)
        obj.firstName = ""
        req.body = obj

        await signupValidation(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith('firstName is not Valid')

    })
    it('should not validate due to lastName is invalid', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        let obj = Object.assign({}, user)
        obj.lastName = ""
        req.body = obj

        await signupValidation(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith('lastName is not Valid')
    })
    it('should not validate due to phone is invalid', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        let obj = Object.assign({}, user)
        obj.phone = 898
        req.body = obj

        await signupValidation(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith('phone Number is not Valid')
    })
    it('should not validate due to email is invalid', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        let obj = Object.assign({}, user)
        obj.email = 'email'
        req.body = obj

        await signupValidation(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith('email is not Valid')

    })
    it('should not validate due to password is invalid', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        let obj = Object.assign({}, user)
        obj.password = 'password'
        req.body = obj


        await signupValidation(req, res, next)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith('The string should have a minimum of 1 uppercase letter')

    })
    it('should not validate due to email is already existed', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()

        req.body = Object.assign({}, user)

        let spyFindOne = jest.spyOn(db.user, 'findOne').mockImplementation(() => Promise.resolve(user))


        await signupValidation(req, res, next)

        expect(spyFindOne).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith('Change Email Address')
    })
    it('should not validate due to phone is already existed', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()

        req.body = Object.assign({}, user)

        let spyFindOne = jest.spyOn(db.user, 'findOne').mockImplementationOnce(() => Promise.resolve(null))
        let spyFindOnePhone = jest.spyOn(db.user, 'findOne').mockImplementation(() => Promise.resolve(user)
        )

        await signupValidation(req, res, next)

        expect(spyFindOne).toHaveBeenCalled()
        expect(spyFindOnePhone).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith('Change Phone Number')
    })
})

describe('password Validation while signin', () => {
    it('should pass Validation', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        req.body.detail = 'omkar'
        req.body.password = "Omkar@123"

        await passwordValidation(req, res, next)

        expect(next).toHaveBeenCalled()

    });
    it('should not pass Validation due to invalid password', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        req.body.detail = "omkar"
        req.body.password = 'omkarpassword'

        await passwordValidation(req, res, next)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith('password incorrect')
    });
    it('should not pass Validation due to not Enter Any input', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()

        await passwordValidation(req, res, next)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith("Enter Detail")

    });

})
describe('identifyInput Validation while signin', () => {

    it('should pass to identifyInput as a email', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()

        req.body.detail = "omkar@gmail.com"

        await identifyInput(req, res, next)

        expect(req.body.type).toBe('email')
        expect(next).toHaveBeenCalled()

    });
    it('should pass to identifyInput as a phone', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()

        req.body.detail = 7841935494

        await identifyInput(req, res, next)

        expect(req.body.type).toBe('phone')
        expect(next).toHaveBeenCalled()

    });
    it('should not pass due to incorrect email or phone', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()

        req.body.detail = 'omkar'

        await identifyInput(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith('Enter Email or Phone')

    });
    it('should not pass due to not passing any detail', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()



        await identifyInput(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith('Enter Email or Phone')

    });

})