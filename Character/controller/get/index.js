const express = require('express');
const db = require('../../model/db');
const router = express.Router()
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

router.get('/', (req, res) => {

    db.query('SELECT * FROM anime', (err, data) => {
        data.sort((a,b)=>{
            return b.mont - a.mont
        })
        const pathfile = data.map(data => path.join('./all', data.tentruyen))
        const linkavatar = pathfile.map(item => fs.readdirSync(path.join(`./${item}/avatar`)));

        res.render('home', { data: data, linkavatar: linkavatar })
    })

})

router.get('/theloai/:name', (req, res) => {
    db.query(`SELECT * FROM anime where theloai='${req.params.name}'`, (err, data) => {
        if (err) throw err
    
        const pathfile = data.map(data => path.join('./all', data.tentruyen))
        const linkavatar = pathfile.map(item => fs.readdirSync(path.join(`./${item}/avatar`)));
      
        db.query('SELECT * FROM tacgia',(err, datades)=>{
            res.render('theloai', { data: data, linkavatar: linkavatar,datades:datades })
        })
      
    })
})

router.get('/anime/:name', (req, res) => {
    const pathAll = path.join(`./all/${req.params.name}`)
    const mapName = fs.readdirSync(pathAll)
    const arrayCha = mapName.filter(item => item !== 'avatar')
    const arrayName = mapName.filter(item => item === 'avatar')
    const docfile = fs.readdirSync(`${pathAll}/${arrayName}`)
    db.query(`SELECT * FROM tacgia`,(err,data)=>{
        res.render('anime', { name: req.params.name, avatar: docfile, cha: arrayCha,tacgias:data })
    })

})



router.get('/animes/:name/:id', (req, res) => {
    const pathAll = path.join(`./all/${req.params.name}`)
    const mapName = fs.readdirSync(pathAll)
    const arrayCha = mapName.filter(item => item !== 'avatar')
    const fileImg = fs.readdirSync(`${pathAll}/${req.params.id}`)

    res.render('animeCha', { name: req.params.name, cha: arrayCha, fileImg: fileImg, id: req.params.id })
})

router.get('/postanime', (req, res) => {
    if (Number(req.cookies.online)) {
        db.query('SELECT * FROM tacgia', (err, results1) => {
            if (err) throw err;
            db.query('SELECT * FROM theloai', (err, results2) => {

                res.render('postanime', { data: results1, data2: results2 })
            })

        })
    } else {
        res.send('Hỏi quản trị viên web')
    }


})
router.get('/posttheloai', (req, res) => {
    if (Number(req.cookies.online)) {
        res.render('posttheloai')
    } else {
        res.send('Hỏi quản trị viên web')
    }

})

router.get('/posttacgia', (req, res) => {
    if (Number(req.cookies.online)) {
        res.render('posttacgia')
    } else {
        res.send('Hỏi quản trị viên web')
    }

})

router.get('/search/:name', (req, res) => {
    res.render('search')
})

router.get('/dangnhap', (req, res) => {
    res.render('dangnhap')
})

router.get('/admin', (req, res) => {
    if (Number(req.cookies.online)) {
        const mang = [{ link: '/posttacgia', title: 'Post Tác\ngiả', des: 'Tác giả' },
            { link: '/posttheloai', title: 'Post Thể\nloại', des: 'Thể loại' },
            { link: '/postanime', title: 'Post Anime', des: 'Anime' },
            { link: '/deltheloai', title: 'Del thể loại', des: 'Del' },
            { link: '/deltacgia', title: 'Del tác giả', des: 'Del' },
            { link: '/delanime', title: 'Del Anime', des: 'Del' }
        ]
        res.render('admin', { mangs: mang })
    }else{
        res.send('Hỏi quản trị viên web')
    }

})

//delete

router.get('/delAnime', (req, res) => {
    if (Number(req.cookies.online)) {
        res.render('delAnime')
    }else{
        res.send('Hỏi quản trị viên web')
    }

})
router.get('/deltheloai', (req, res) => {
    if (Number(req.cookies.online)) {
        res.render('deltheloai')
    }else{ res.send('Hỏi quản trị viên web')}

 })
 router.get('/deltacgia', (req, res) => {
    if (Number(req.cookies.online)) {
        res.render('deltacgia')
    }else{ res.send('Hỏi quản trị viên web')}

 })
module.exports = router