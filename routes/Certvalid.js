const express=require("express")
const { default: mongoose } = require("mongoose")
const router =express.Router()
const requireAuth = require('../middlewares/checkAuth')
const Cert = mongoose.model('Cert')
const Pk = mongoose.model('Pk')
const { validateCertKeyPair,validateSSL } = require('ssl-validator');
let certif=`-----BEGIN CERTIFICATE-----
MIICtDCCAZygAwIBAgIULBhfjrnsMkNUvOPE0aGwbfVRwBkwDQYJKoZIhvcNAQEL
BQAwFDESMBAGA1UEAwwJbG9jYWxob3N0MB4XDTIyMDkwNzExMjkxOFoXDTIzMDkw
NzExMjkxOFowFDESMBAGA1UEAwwJbG9jYWxob3N0MIIBIjANBgkqhkiG9w0BAQEF
AAOCAQ8AMIIBCgKCAQEAsy0MKUaLa+R2cl6XU/Az7WyJLf0tivbjEzgYWfDgrOG+
txwj9pF9M7g6LY3e08cKMqdcaRnSFrwaU/E/kasmp1JZ2LZRNOjUU7eJ2NA2JxoY
2LofTw07QE5OPP3tfnREFhZo1y45ebGsBvUNNZLU9E/oFF9ZxRbUHRfv3Xz/2sOt
XUTZbSXxlr/GHPMOJ4eWgrbcELB4GDa90o+iBrnddk80/CWPhmuNM9dbq1wgN5Rk
TpjFthnQwbWsy1HiwF/zCynxlwjCQDhEfb7uFh2LDJ/wdnaausaUgvKPFiHwDO4Z
V8E4UUef6PXCvfrW/ogbCGpybnz/Gnw77SAJOmrxYQIDAQABMA0GCSqGSIb3DQEB
CwUAA4IBAQAqx/Grd6UNaIjV3J/OtbgXzNWWUu8sjWUE4u2YHYX4k84SbZ3/nSfG
J01FJsPXBa6F6NVM1Vep/t6+tfxY5FvOPz8m50q8T2RQDmMZeo1lR287ndiVcZg/
Q6uuIIz4xBMlkiMybZydr8z4NQPOcVlM5TQbbFf44GGTSbWKlehwxtN88pOLHcDe
hkYX9EUNHkkFR6DXRGVhDLQJsa5zjy/A78uj1ssX58W3qM+z1nJ2XQTIZ+IBsSFM
U7UjELcfBlrhKp7q6QAU+OzS+I9BmOpKfi+xjSGWciLq0DU34+yqPQ/x4LAQlOVO
7HY9GrnOsZyCT6AlHZ5pvSGuGci2rgro
-----END CERTIFICATE-----
`



let pki=`-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAsy0MKUaLa+R2cl6XU/Az7WyJLf0tivbjEzgYWfDgrOG+txwj
9pF9M7g6LY3e08cKMqdcaRnSFrwaU/E/kasmp1JZ2LZRNOjUU7eJ2NA2JxoY2Lof
Tw07QE5OPP3tfnREFhZo1y45ebGsBvUNNZLU9E/oFF9ZxRbUHRfv3Xz/2sOtXUTZ
bSXxlr/GHPMOJ4eWgrbcELB4GDa90o+iBrnddk80/CWPhmuNM9dbq1wgN5RkTpjF
thnQwbWsy1HiwF/zCynxlwjCQDhEfb7uFh2LDJ/wdnaausaUgvKPFiHwDO4ZV8E4
UUef6PXCvfrW/ogbCGpybnz/Gnw77SAJOmrxYQIDAQABAoIBABIYm6DTkiM8eMYG
TaxZlzUEgDpX1rCxTK/VO4hh7p8nUZa2zd8KRKXjlmShbn7fHGWPR6MJy5EmQFZ4
CB6TNZ0ykQZ1K3B3j3JBGDgAl2eNmDLTYXQfdvuArSA12TWrUnEUpFQPRBjJXAF7
4HCnusBODbd5Bd0E+DlUAJLTHBgg/cHmobq1G+qY731RJQF7egXjRXUa41Ip94im
o63M6OQn4eP5XTKKdPdY4xUhTTHZLrS+oKfmFXRDxClyl5hCf6I45MlfuIZuuh8o
B7LykRT8JAOfWmrsShti2AfBiVkpZArUBA/YpOfzafFrXp5uOi1sQ3qQ7os4iSeL
/lF9SkECgYEA6n+amdDm31qLIE1C8TCHaZ03GB71HG/hbeEtJlEgUx+VXHJMuLFc
bR8jfkUcMLIDLVYPFlAB/DhkkxZI4u4lE+/jnV3q54uw07efH9MCYNUe4U1jVaZB
LtA20t0DPs7kxU+XUhan75WMQMrSCkhEPbwuS0MkShfu71BR/SPc6SkCgYEAw5rb
CK0xZO/dKHNrfQ1CfHClWHx9a6EDIuZHIEy5k5R2ZGX76YRG9GJLHLZVgSv6UOz1
7N/HkBDA5dVqu7exuoeCjEsylr6dJ8HTRTtmMj19iik3PMruU1bg4yWurlpvY0MQ
11gHgZThD5b7KOywXgbe8kQzG/YEhkaqn+4JdXkCgYBO6zL0oUGR2b8I1/e3hEWO
XcK083Y6Y8zSVf4D7zmZv/9cZXs8jTQ15Uzkqg2atc4r69KYB8UjRTdT6SQOe2cv
FoTb6UetNW4FUr7Szwj13cPOv2S25oT5ZEmPHaKB+M81OFwM3GMYVpQlGh0mKLwO
qs5Jtgb4iKV5FOcC8pbeQQKBgHYDU+skMwzm+tOQ72T/PwG9JMUCNtlcx3ui237N
S5mSlOt17EqzF+wR8addCrFoSxnQHX/Qc6KjuP3xiPfAmGYlo8npBJiWYFLASisW
702Yc8mLnFv9Q1TcscnZzk47GcEVkW+bGMxBepfhS58hTjcshg48v2k7QPeSYxci
kmphAoGAVHB40fINUrmbBxn6dfn/gj6GPbY1cZ+5LNeHErcmz/8iy00/LbNYlfjQ
dqocHa+F8uOYz7mUxHCd/T9jcdEra1n4jL0H197pqFPtuz0EobqP1xhWbGq6XAH8
YD3UwsyjsIHW7SOaTqxDIjwAjE3KbAFi6CjkZZOBWQhg11CIzeI=
-----END RSA PRIVATE KEY-----
`



router.get('/certvalid',requireAuth,async (req,res)=>{
    let data;
    let cert;
    let pkey;
    let id;
    try{
        data=await Cert.findOne({domain:req.body.domain,email:req.body.email})
        cert=data.cert
        id = data._id


    }catch(err){
        return res.json({error:"Couldn't fetch certificates"})
    }
    try{
        data = await Pk.findOne({certId:id})
        pkey = data.pk 
    }catch(err){

        return res.json({error:"Couldn't fetch Private Key"})
    }




    try{
        data=await validateCertKeyPair(certif,pki)
    }catch(err){
        console.log(err)
        const error = new Error("Validation Failed")
        error.code=422
        return res.status(error.code).json(error.message)

    }
    
    return res.send(data)

    
    
    
    
    
    
})

module.exports=router
