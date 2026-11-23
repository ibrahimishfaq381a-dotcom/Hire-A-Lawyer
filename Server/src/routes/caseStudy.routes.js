import { Router } from "express";
import { getAllCaseStudies, postCaseStudy } from "../controllers/caseStudy.controller.js";
import { upload } from "../middlewares/multer.js";


const router = Router()
router.route('/getallcasestudies').get(getAllCaseStudies)
router.route('/postcasestudies').post(upload.single('myfile2'),postCaseStudy)


export default router
