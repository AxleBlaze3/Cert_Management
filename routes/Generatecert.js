const express=require("express")
const { default: mongoose } = require("mongoose")
const router =express.Router()
const requireAuth = require('../middlewares/checkAuth')
const Cert = mongoose.model('Cert')
const Pk = mongoose.model('Pk')
const fs = require('fs')
const openssl = require('openssl-nodejs')
const {ObjectId} = require('mongodb');
var pem = require('pem')

router.post('/generatecert',requireAuth,async(req,res)=>{
    let key 
    let cert
    const {
        days,
        countryName,
        stateOrProvinceName,
        localityName,
        organizationName,
        organizationalUnitName,
        commonName,
        emailAddress,
        basicConstraints,
        keyUsage,
        basicConstraintsCA
    } = req.body;

    var confData = `[req]\ndays = ${days}\ndistinguished_name = req_distinguished_name\nreq_extensions = v3_req\nx509_extensions = v3_ca\nprompt = no\n\n[req_distinguished_name]\ncountryName = ${countryName}\nstateOrProvinceName = ${stateOrProvinceName}\nlocalityName = ${localityName}\norganizationName = ${organizationName}\norganizationalUnitName = ${organizationalUnitName}\ncommonName = ${commonName}\nemailAddress = ${emailAddress}\n\n[v3_req]\nbasicConstraints = ${basicConstraints}\nkeyUsage = ${keyUsage}\n\n[v3_ca]\nbasicConstraints = ${basicConstraintsCA}`; 
    let id = ObjectId()
    id = "./"+id
    let success

    fs.mkdir(id, (err) => {
        if (err) {
            throw err;
        }
        console.log("Directory is created.");
    })
        

    try{
        success = fs.writeFileSync(id+"/myConf.conf", confData)
    }catch(err){
        console.log("Write Failed")
    }
    pem.createCSR({ csrConfigFile:id+'/myConf.conf' }, function (err, keys) {
        if (err) {
          throw err
        }

        ck = keys.clientKey
        csr = keys.csr

        return res.json({csr:csr})
        
       

        


    })
        
    


    //return res.json({key:"Hello"})

})

module.exports = router