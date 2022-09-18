const express=require("express")
const { default: mongoose } = require("mongoose")
const router =express.Router()
const requireAuth = require('../middlewares/checkAuth')
const Cert = mongoose.model('Cert')
const Pk = mongoose.model('Pk')
const { validateCertKeyPair,validateSSL } = require('ssl-validator');


router.get('/user_certs',requireAuth,async(req,res)=>{
    let data
    let certif
    let pk
    try{
        data = await Cert.find({email:req.body.email})

    }catch(err){
        return res.json({error:"Couldn't fetch certificates"})
    }

    try{
        data = await Pk.findOne({certId:id})
        pk = data.pk 
    }catch(err){

        return res.json({error:"Couldn't fetch Private Key"})
    }

    try{
        data=await validateCertKeyPair(certif,pk)
    }
    
    
    return res.send(data)
})

module.exports = router

