import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ msg: "¡Por favor, ingrese a su cuenta!" });
        }

        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Establecer el ID y el rol del usuario en las propiedades de req
        req.userId = user.id;
        req.role = user.role;

        next();
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const adminOnly = async (req, res, next) =>{
    try {
        // Verificar si el usuario está autenticado
        if (!req.session.userId) {
            return res.status(401).json({msg: "¡Por favor, ingrese a su cuenta!"});
        }

        // Buscar al usuario en la base de datos usando el uuid de la sesión
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });

        // Si el usuario no se encuentra, devolver un error de usuario no encontrado
        if (!user) {
            return res.status(404).json({msg: "Usuario no encontrado"});
        }

        // Verificar si el usuario tiene el rol de administrador
        if (user.role === "admin") {
            // Si todo está bien, asignar el ID y el rol del usuario a req.userId y req.role
            req.userId = user.id;
            req.role = user.role;
            // Pasar al siguiente middleware
            return next();
        }

        // Si el usuario no es administrador, devolver un error de acceso prohibido
        return res.status(403).json({msg: "Acceso Prohibido"});
        
    } catch (error) {
        // Manejar cualquier error
        res.status(500).json({msg: error.message});
    }
};




export const receptionistOrAlumnoOnly = async (req, res, next) => {
    try {
        // Verificar si el usuario está autenticado
        if (!req.session.userId) {
            return res.status(401).json({ msg: "¡Por favor, ingrese a su cuenta!" });
        }

        // Buscar al usuario en la base de datos usando el uuid de la sesión
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });

        // Si el usuario no se encuentra, devolver un error de usuario no encontrado
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Verificar si el usuario tiene el rol de recepcionista, alumno o admin
        if (user.role !== "recepcion" && user.role !== "alumno" && user.role !== "admin") {
            return res.status(403).json({ msg: "Acceso Prohibido" });
        }

        // Si el usuario es alumno, se le permite acceder a la ruta
        if (user.role === "alumno") {
            req.userId = user.id;
            req.role = user.role;
            return next();
        }

        // Si el usuario es recepcionista, se continúa con la lógica existente
        req.branch = user.branch;
        if (req.params.branch && user.branch !== req.params.branch) {
            return res.status(403).json({ msg: "Acceso Prohibido a esta sucursal" });
        }
        
        req.userId = user.id;
        req.role = user.role;
        next();
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
