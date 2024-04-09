import ScheduledClass from "../models/ScheduledClass.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getScheduledClass = async (req, res) => {
    try {
        let response;

        if (req.role === "admin") {
            // Si el usuario es un administrador, mostrar todas las citas programadas
            response = await ScheduledClass.findAll({
                attributes: ['uuid', 'classDate', 'startTime', 'endTime', 'branch'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }],
                order: [['classDate', 'DESC']] // Ordenar por fecha de manera descendente
            });
        } else if (req.role === "recepcion") {
            // Si el usuario es un recepcionista, mostrar solo las citas de su sucursal
            response = await ScheduledClass.findAll({
                attributes: ['uuid', 'classDate', 'startTime', 'endTime', 'branch'],
                where: {
                    branch: req.branch // Filtrar por la sucursal del usuario
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }],
                order: [['classDate', 'DESC']] // Ordenar por fecha de manera descendente
            });
        } else if (req.role === "alumno") {
            // Si el usuario es un alumno, mostrar solo las citas que le pertenecen
            response = await ScheduledClass.findAll({
                attributes: ['uuid', 'classDate', 'startTime', 'endTime', 'branch'],
                where: {
                    userId: req.userId // Filtrar por el ID del usuario
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }],
                order: [['classDate', 'DESC']] // Ordenar por fecha de manera descendente
            });
        } else {
            // Si el usuario no es ni administrador, ni recepcionista, ni alumno, devolver un error de acceso prohibido
            return res.status(403).json({ msg: "Acceso Prohibido" });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}



export const getScheduledClassById = async(req, res) =>{
    try {
        const scheduledclass = await ScheduledClass.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!ScheduledClass) return res.status(404).json({msg: "Datos no encontrados"});
        let response;
        if(req.role === "admin"){
            response = await ScheduledClass.findOne({
                attributes:['uuid','classDate','startTime', 'endTime', 'branch'],
                where:{
                    id: scheduledclass.id
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await ScheduledClass.findOne({
                attributes:['uuid','classDate','startTime', 'endTime', 'branch'],
                where:{
                    [Op.and]:[{id: scheduledclass.id}, {userId: req.userId}]
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createScheduledClass = async(req, res) =>{
    const {classDate,startTime, endTime, branch} = req.body;
    try {
        await ScheduledClass.create({
            classDate: classDate,
            startTime: startTime,
            endTime: endTime,
            branch: branch,            
            userId: req.userId
        });
        res.status(201).json({msg: "Clase Registrada con éxito"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateScheduledClass = async(req, res) =>{
    try {
        const scheduledclass = await ScheduledClass.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!scheduledclass) return res.status(404).json({msg: "Datos no encontrados"});
        const {classDate,startTime, endTime, branch} = req.body;
        if(req.role === "admin"){
            await ScheduledClass.update({classDate,startTime, endTime, branch},{
                where:{
                    id: scheduledclass.id
                }
            });
        }else{
            if(req.userId !== scheduledclass.userId) return res.status(403).json({msg: "Acceso prohibido"});
            await ScheduledClass.update({classDate,startTime, endTime, branch},{
                where:{
                    [Op.and]:[{id: scheduledclass.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Clase Registrada actualizada exitosamente"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteScheduledClass = async(req, res) =>{
    try {
        const scheduledclass = await ScheduledClass.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!scheduledclass) return res.status(404).json({msg: "Datos no encontrados"});
        const {classDate,startTime, endTime, branch} = req.body;
        if(req.role === "admin"){
            await ScheduledClass.destroy({
                where:{
                    id: scheduledclass.id
                }
            });
        }else{
            if(req.userId !== scheduledclass.userId) return res.status(403).json({msg: "Acceso prohibido"});
            await ScheduledClass.destroy({
                where:{
                    [Op.and]:[{id: scheduledclass.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Clase Eliminada Satisfactoriamente"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}