import Users from "../models/UserModel.js";
import People from "../models/PeopleModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id', 'name', 'email']
        });
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
    }
}

export const getPeople = async(req, res) => {
    try {
        const people = await People.findAll({
            attributes:['id', 'name', 'location']
        });
        res.status(200).json(people);
    } catch (error) {
        console.log(error);
    }
}

export const deletePeople = async(req, res) => {
    try {
        const people = await People.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(people);
    } catch (error) {
        console.log(error);
    }
}

export const editPeople = async(req, res) => {
    try {
        const people = await People.update({
            name: req.body.name,
            location: req.body.location
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(people);
    } catch (error) {
        console.log(error);
    }
}

export const addPeople = async(req, res) => {
    try {
        const people = await People.create({
            name: req.body.name,
            location: req.body.location
        });
        res.status(200).json(people);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async(req, res) => {
    const { name, email, password, confPassword } = req.body;
    if (password !== confPassword) {
        return res.status(400).json({msg: "Password doesn't match"});
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword
        });
        res.json({msg: "User created!"})
    } catch (error) {
        console.log(error);
    }
}

export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) {
            return res.status(400).json({msg: "Invalid credentials!"});
        }
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken}, {
            where: {
                id: userId
            }
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg: "Email was not found!"});
    }
}

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(204);
    }
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user[0]) {
        return res.sendStatus(204);
    }
    const userId = user[0].id
    await Users.update({refresh_token: null}, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}