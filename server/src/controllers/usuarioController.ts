import { Request, Response } from 'express';
import pool from "../database";
import { v4 as uuidv4 } from 'uuid'; 

class UsuarioController {
    public async list(req: Request, res: Response): Promise<void> {
        const usuarios = await pool.query('SELECT * FROM Usuario');
        res.json({ usuarios });
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const { Nombre, ApPaterno, ApMaterno, NumTelefono, Correo, FechaNacimiento, Usuario, Contrasena, Rol, CodigoAdmin } = req.body;

            if (Rol === 'superAdmin') {
                const nuevoCodigo = uuidv4();
                await pool.query('INSERT INTO Usuario SET ?', [
                    { Nombre, ApPaterno, ApMaterno, NumTelefono, Correo, FechaNacimiento, Usuario, Contrasena, Rol, CodigoAdmin: nuevoCodigo }
                ]);
                res.json({ message: 'SuperAdmin creado con éxito', codigo: nuevoCodigo });
    
            } else if (Rol === 'admin') {
                const nuevoCodigo = uuidv4(); 
                await pool.query('INSERT INTO Usuario set ?', [{ Nombre, ApPaterno, ApMaterno, NumTelefono, Correo, FechaNacimiento, Usuario, Contrasena, Rol, CodigoAdmin: nuevoCodigo }]);
                res.json({ message: 'Administrador creado con éxito', codigo: nuevoCodigo });
            } else if (Rol === 'normal') {
                const admin = await pool.query('SELECT * FROM Usuario WHERE CodigoAdmin = ? AND Rol = "admin"', [CodigoAdmin]);
                if (admin.length > 0) {
                    await pool.query('INSERT INTO Usuario set ?', [{ Nombre, ApPaterno, ApMaterno, NumTelefono, Correo, FechaNacimiento, Usuario, Contrasena, Rol, CodigoAdmin }]);
                    res.json({ message: 'Usuario normal creado con éxito' });
                } else {
                    res.status(400).json({ error: 'Código de administrador inválido' });
                }
            } else {
                res.status(400).json({ error: 'Rol no especificado o inválido' });
            }
        } catch (err) {
            console.error('Error al crear usuario:', err);
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { idUser } = req.params;
        await pool.query('DELETE FROM Usuario WHERE IdUsuario = ?', [idUser]);
        res.json({ message: 'El usuario fue eliminado' });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { idUser } = req.params;
        await pool.query('UPDATE Usuario set ? WHERE IdUsuario = ?', [req.body, idUser]);
        res.json({ message: 'El usuario fue actualizado' });
    }

    public async getUserOrCheckUsername(req: Request, res: Response): Promise<void> {
        const { identifier } = req.params;
    
        if (isNaN(Number(identifier))) {
            const usuario = await pool.query('SELECT * FROM Usuario WHERE Usuario = ?', [identifier]);
            if (usuario.length > 0) {
                res.json({ exists: true });
            } else {
                res.json({ exists: false });
            }
        } else {
            const usuario = await pool.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [identifier]);
            if (usuario.length > 0) {
                res.json(usuario[0]); 
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        }
    }
    // Método para obtener el correo basado en el ID del usuario
public async getGmail(userId: number): Promise<string | null> {
    try {
        const result = await pool.query('SELECT Correo FROM Usuario WHERE IdUsuario = ?', [userId]); // Obtiene el correo

        if (result.length > 0) {
            return result[0].Correo; // Retorna el correo si se encuentra
        }
    } catch (error) { 
        console.error('Error al obtener el correo', error);  //Error en caso de no encontrar el correo
    }
    return null;
}

}

export const usuarioController = new UsuarioController();
export default usuarioController;
