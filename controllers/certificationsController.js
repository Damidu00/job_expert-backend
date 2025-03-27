import Certificates from "../models/certificationsModel.js"

export async function createCertificates(req,res){
    try {
        const certificateDetails = req.body
        const certificate = new Certificates(certificateDetails)
        await certificate.save()

        res.status(200).json({
            message : "Certicates saved"
        })
    } catch (error) {
        res.status(500).json({
            message : "error to create certificates",
            error : error.message
        })
    }
}

export async function getAllCertificates(req,res){
    try {
        const userId = req.params.userId
        const certificates = await Certificates.findOne({userId : userId})

        res.json(certificates)
    } catch (error) {
        res.status(500).json({
            message : "error to fetch certificates",
            error : error.message
        })
    }

}