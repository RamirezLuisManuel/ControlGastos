import { Request, Response } from 'express';
import pool from '../database';

class GastoController {
  public async list(req: Request, res: Response): Promise<void> {
    const { idUser } = req.params;

    try {
      const usuario = await pool.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);

      if (usuario.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      const { Rol } = usuario[0];

      let query: string;
      let params: any[];

      if (Rol === 'superAdmin') {
        query = `
            SELECT 
                G.*, 
                CONCAT(U.Nombre, ' ', U.ApPaterno, ' ', U.ApMaterno) AS NombreCompletoUsuario, 
                U.Rol AS RolUsuario,
                CASE
                    WHEN A.Rol = 'admin' OR A.Rol = 'superAdmin' THEN CONCAT(A.Nombre, ' ', A.ApPaterno, ' ', A.ApMaterno)
                    ELSE NULL
                END AS NombreCompletoAdmin
            FROM Gasto G
            INNER JOIN Usuario U ON G.IdUsuario = U.IdUsuario
            LEFT JOIN Usuario A ON U.CodigoAdmin = A.CodigoAdmin AND (A.Rol = 'admin' OR A.Rol = 'superAdmin')
        `;
        params = [];
      } else if (Rol === 'admin') {
        query = `
                SELECT 
                    G.*, 
                    CONCAT(U.Nombre, ' ', U.ApPaterno, ' ', U.ApMaterno) AS NombreCompletoUsuario
                FROM Gasto G
                INNER JOIN Usuario U ON G.IdUsuario = U.IdUsuario
                WHERE U.CodigoAdmin = ?
            `;
        params = [usuario[0].CodigoAdmin];
      } else {
        query = `
                SELECT 
                    G.*, 
                    CONCAT(U.Nombre, ' ', U.ApPaterno, ' ', U.ApMaterno) AS NombreCompletoUsuario
                FROM Gasto G
                INNER JOIN Usuario U ON G.IdUsuario = U.IdUsuario
                WHERE G.IdUsuario = ?
            `;
        params = [idUser];
      }

      const gastos = await pool.query(query, params);
      res.json({ gastos });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener los gastos' });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { idUser } = req.params;
    const gasto = req.body;
    gasto.IdUsuario = idUser;

    try {
      await pool.query('INSERT INTO Gasto SET ?', [gasto]);
      res.json({ message: 'Gasto guardado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear el gasto' });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id, idUser } = req.params;

    try {
      const usuario = await pool.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);

      if (usuario.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      const { Rol } = usuario[0];

      let result;
      if (Rol === 'superAdmin') {
        result = await pool.query('DELETE FROM Gasto WHERE IdGasto = ?', [id]);
      } else if (Rol === 'admin') {
        result = await pool.query('DELETE FROM Gasto WHERE IdGasto = ? AND EXISTS (SELECT 1 FROM Usuario WHERE IdUsuario = Gasto.IdUsuario AND CodigoAdmin = ?)', [id, usuario[0].CodigoAdmin]);
      } else {
        result = await pool.query('DELETE FROM Gasto WHERE IdGasto = ? AND IdUsuario = ?', [id, idUser]);
      }

      if (result.affectedRows > 0) {
        res.json({ message: 'Gasto eliminado' });
      } else {
        res.status(404).json({ error: 'Gasto no encontrado o el usuario no tiene permisos' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar el gasto' });
    }
  }


  public async update(req: Request, res: Response): Promise<void> {
    const { id, idUser } = req.params;
    const gasto = req.body;

    try {
      const usuario = await pool.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);

      if (usuario.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      const { Rol } = usuario[0];

      let result;
      if (Rol === 'superAdmin') {
        result = await pool.query('UPDATE Gasto SET ? WHERE IdGasto = ?', [gasto, id]);
      } else if (Rol === 'admin') {
        result = await pool.query('UPDATE Gasto SET ? WHERE IdGasto = ? AND EXISTS (SELECT 1 FROM Usuario WHERE IdUsuario = Gasto.IdUsuario AND CodigoAdmin = ?)', [gasto, id, usuario[0].CodigoAdmin]);
      } else {
        result = await pool.query('UPDATE Gasto SET ? WHERE IdGasto = ? AND IdUsuario = ?', [gasto, id, idUser]);
      }

      if (result.affectedRows > 0) {
        res.json({ message: 'Gasto actualizado' });
      } else {
        res.status(404).json({ error: 'Gasto no encontrado o el usuario no tiene permisos' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar el gasto' });
    }
  }



  public async getOne(req: Request, res: Response): Promise<void> {
    const { id, idUser } = req.params;

    try {
      const usuario = await pool.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);

      if (usuario.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      const { Rol, CodigoAdmin } = usuario[0];

      let query;
      let params;

      if (Rol === 'superAdmin') {
        query = 'SELECT * FROM Gasto WHERE IdGasto = ?';
        params = [id];
      } else if (Rol === 'admin') {
        query = `
          SELECT * FROM Gasto WHERE IdGasto = ? AND EXISTS (
            SELECT 1 FROM Usuario WHERE IdUsuario = Gasto.IdUsuario AND CodigoAdmin = ?
          )
        `;
        params = [id, CodigoAdmin];
      } else {
        query = 'SELECT * FROM Gasto WHERE IdGasto = ? AND IdUsuario = ?';
        params = [id, idUser];
      }

      const gasto = await pool.query(query, params);

      if (gasto.length > 0) {
        gasto[0].FechaTransaccion = gasto[0].FechaTransaccion.toISOString().split('T')[0];
        res.json(gasto[0]);
      } else {
        res.status(404).json({ text: 'El gasto no existe o no tiene acceso' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener el gasto' });
    }
  }
}

export const gastoController = new GastoController();
export default gastoController;