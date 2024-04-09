import express from "express";
import {
    getScheduledClass,
    getScheduledClassById,
    createScheduledClass,
    updateScheduledClass,
    deleteScheduledClass
} from "../controllers/ScheduledClass.js";
import { verifyUser, adminOnly, receptionistOrAlumnoOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/class', verifyUser, receptionistOrAlumnoOnly, getScheduledClass);
router.get('/class/:id', verifyUser, getScheduledClassById);
router.post('/class', verifyUser, createScheduledClass);
router.patch('/class/:id', verifyUser, updateScheduledClass);
router.delete('/class/:id', verifyUser, deleteScheduledClass);

export default router;
