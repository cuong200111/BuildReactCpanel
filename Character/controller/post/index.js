const express = require('express');
const router = express.Router()
const fs = require('fs');
const { memoryStorage } = require('multer');
const multer = require('multer');
const path = require('path');
const db = require('../../model/db')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const des = req.body.name
        const tap = req.body.character
        const pathfile = path.join(`./all/${des}/${tap}`)
        const pathAvatar = path.join(`./all/${des}/avatar`)

        fs.mkdirSync(pathfile, { recursive: true })
        fs.mkdirSync(pathAvatar, { recursive: true })
        if (file.fieldname === 'image') {
            cb(null, pathfile)
        }
        if (file.fieldname === 'avatar') {
            const docfile = fs.readdirSync(pathAvatar)
            if (docfile.length === 1) {
                fs.unlinkSync(path.join(pathAvatar, docfile[0]))
            }
            cb(null, pathAvatar)



        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({
        storage: storage,
    })
    //post anime

router.post('/postanime', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'image', maxCount: undefined }]), (req, res, next) => {

    const date = new Date()
    db.query('SELECT * FROM anime', (err, rows) => {
        if (err) throw err
        const name = rows.find(row => row.tentruyen === req.body.name)

        if (name) {

            db.query(`UPDATE anime set mont = '${date.getTime()}' where tentruyen ='${req.body.name}'`)
            res.redirect('/postanime')
            next()
        } else {

            db.query(`INSERT INTO anime (tentruyen,idtacgia,mont,theloai) VALUES('${req.body.name}','${req.body.idtacgia}','${date.getTime()}','${req.body.theloai}')`, (err) => {
                if (err) throw err
                res.redirect('/postanime')
            })
        }
    })


})


//post tacgiao
router.post('/posttacgia', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    if (id && name) {
        db.query(`SELECT * from tacgia`, (err, data) => {
            const finddata = data.find(item => item.idtacgia === id)
            if (finddata) {
                res.send('tác giả đã tồn tại:))')
            } else {
                db.query(`INSERT INTO tacgia (idtacgia,tentacgia) VALUES('${id}','${name}')`, (err) => {
                    if (err) { console.log('loi') }
                    res.redirect('/posttacgia')
                })
            }
        })

    } else {
        if (id) {
            console.log('tim thay id')
        } else {
            console.log('khong tim thay id')
        }
        if (name) {
            console.log('tim thay name')
        } else {
            console.log('khong tim thay name')
        }
    }

})
router.post('/posttheloai', (req, res) => {
    db.query(`INSERT INTO theloai (listtl) VALUES('${req.body.theloai}')`, (err) => {
        if (err) { console.log('loi') }
        res.redirect('/posttheloai')
    })
})


router.post('/postdangnhap', (req, res) => {

    db.query('SELECT * FROM admin', (err, data) => {
        if (err) throw err

        if (req.body.user !== data[0].name || `${req.body.pass}` !== `${data[0].pass}`) {
            res.redirect('/dangnhap')
        } else {

            res.cookie('online', 1, { httpOnly: true })
            res.redirect('/admin')
        }
    })


})



router.post('/search', (req, res) => {
    res.redirect('/search')
})
router.post('/delAnime', (req, res) => {
    const pat = path.join(`./all/${req.body.name}`)
    
    db.query(`DELETE FROM anime WHERE tentruyen = '${req.body.name}'`, (err) => {
        if (err) throw err
        const handleDel = (link)=>{
            if(fs.existsSync(link)){
                fs.readdirSync(link).forEach((item,index)=>{
                    const curP = link+'/'+ item
                    if(fs.lstatSync(curP).isDirectory()){
                        handleDel(curP)
                    }else{
                        fs.unlinkSync(curP)
                    }
                    
                });
                fs.rmdirSync(link);
            }
            }
            handleDel(pat)
        res.redirect('/delanime')
    })
  
})
router.post('/deltheloai', (req, res) => {
    db.query(`DELETE FROM theloai where listtl = '${req.body.name}'`,(err)=>{
        if (err) throw err
        res.redirect('deltheloai')
    })
})
router.post('/deltacgia', (req, res) => {
    db.query(`DELETE FROM tacgia where idtacgia = '${req.body.name}'`,(err)=>{
        if (err) throw err
        res.redirect('deltacgia')
    })
})
module.exports = router