const data = require('../data/data.json');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';



// fonction get all users 
const getAllUsers = (req, res) => {
    res.json(data);
}

// fonction signUp
const signUp = (req, res) => {
    let id = Math.floor(Math.random() * 1000)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userExist = data.find(user => user.email == req.body.email);

    if (userExist) {
        return res.status(400).json({ errors: "user already exists" });
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 12);
    data.push({id:id, name: req.body.name, email: req.body.email, password: hashedPassword });
    fs.writeFile(path.join(__dirname, "../data/data.json"), JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error appending to file:', err);
            return;
        }
        console.log('Content appended to file.');
    });
    res.json(data)
}

//fonction login
const login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userExist = data.find(user => user.email == req.body.email);

    if (!userExist) {
        return res.status(400).json({ errors: "user not exists" });
    }
    const comparePassword = bcrypt.compareSync(req.body.password, userExist.password);
    if (!comparePassword) {
        return res.status(400).json({ errors: "invalid password" });
    }
    const token = jwt.sign({ name: userExist.name, role: 'admin'}, secretKey);
    res.json(token);
}


//fonction updateUser
const updatUser = (req, res) => {
    let user = data.find((user) => user.id == req.params.id)
    if (!user) {
        res.status(404).json({ message: 'user not found' });
    } 
    let index = data.indexOf(user)

    const hashedPassword = bcrypt.hashSync(req.body.password, 12);
    data[index].name = req.body.name
    data[index].email = req.body.email
    data[index].password = hashedPassword
    
    fs.writeFile(path.join(__dirname, "../data/data.json"), JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error appending to file:', err);
            return;
        }
        console.log('Content appended to file.');
    });
    res.json(data)
}
// fonction delete

const deleteUser = (req, res) => {
    let user = data.find((user) => user.id == req.params.id)
    if (!user) {
        res.status(404).json({ message: 'user not found' });
    } 
    let index = data.indexOf(user)
    data.splice(index, 1)
    fs.writeFile(path.join(__dirname, "../data/data.json"), JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error appending to file:', err);
            return;
        }
        console.log('Content appended to file.');
    });
    res.json(data)
}





module.exports = {
    getAllUsers, signUp, login, updatUser, deleteUser
}