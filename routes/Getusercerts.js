const express=require("express")
const { default: mongoose } = require("mongoose")
const router =express.Router()
const requireAuth = require('../middlewares/checkAuth')
const Cert = mongoose.model('Cert')
const Pk = mongoose.model('Pk')
const CryptoJS = require("crypto-js");
const { validateCertKeyPair,validateSSL } = require('ssl-validator');


router.get('/user_certs',requireAuth,async(req,res)=>{
    let data
    let certif
    let pk
    try{
        data = await Cert.findOne({email:req.user.email})
        certif=data.cert
        id = data._id

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
        bytes  = CryptoJS.AES.decrypt(certif, process.env.SECRET_KEY);
        certif = bytes.toString(CryptoJS.enc.Utf8);
        

    }catch(err){
        return res.json({error:"Couldn't fetch certificate."})
    }

    try{
        bytes  = CryptoJS.AES.decrypt(pk, process.env.SECRET_KEY);
        pk = bytes.toString(CryptoJS.enc.Utf8);
        console.log(pk)
        

    }catch(err){
        return res.json({error:"Couldn't fetch certificate. 188"})
    }


    try{
        data=await validateCertKeyPair(certif,pk)
    }catch(err){
        console.log(err)
    }
    
    
    return res.send(data)
})

module.exports = router

