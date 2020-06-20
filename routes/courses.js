const {Router} = require('express')
const {validationResult} = require('express-validator')
const Course = require('../models/course')
const auth = require('../middleware/auth')
const {courseValidators} = require('../utils/validators')
const router = Router()

function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req,res) => {
    try{
        const courses = await Course.find()
        .populate('userId', 'email name') //выводит на странице конкретные поля пользователя
        .select('price title img') //выводит на странице конкретные поля курса
    
        res.render('courses',{
            title: 'Courses',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null, 
            courses
        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id/edit',auth,courseValidators, async (req,res) => {
    if (!req.query.allow){
        return res.redirect('/')
    }
    try{
        const course = await Course.findById(req.params.id)
        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }
        res.render('course-edit',{
            title: `Edit ${course.title}`,
            course
        })
    } catch(e) {
        console.log(e)   
    }
})


router.post('/edit', auth, async (req,res) => {
    const errors = validationResult(req)
    const {id} = req.body
    if(!errors.isEmpty()) {
        return res.status(422).redirect(`/courses/${id}/edit?allow=true`)
    }

    try{
        delete req.body.id
        const course = await Course.findById(id)
        if(!isOwner) {
            return res.redirect('/course')
        }
        Object.assign(course, req.body)
        await course.save()
        res.redirect('/courses')
    } catch(e) {
        console.log(e)
    }
})

router.post('/remove',auth, async (req,res) => {
    try{
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/courses')
    }catch(e){
        console.log(e)
    }
})



router.get('/:id',async (req,res) => {
    try {
        const course = await Course.findById(req.params.id)
        res.render('course', {
            layout: 'empty',
            title: `Course ${course.title}`,
            course
        })
    } catch(e) {
        console.log(e)
    }
})



module.exports = router