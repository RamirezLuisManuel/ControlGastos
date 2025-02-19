"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gastoController = void 0;
const database_1 = __importDefault(require("../database"));
class GastoController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idUser } = req.params;
            try {
                const usuario = yield database_1.default.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);
                if (usuario.length === 0) {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                    return;
                }
                const { Rol } = usuario[0];
                let query;
                let params;
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
                }
                else if (Rol === 'admin') {
                    query = `
                SELECT 
                    G.*, 
                    CONCAT(U.Nombre, ' ', U.ApPaterno, ' ', U.ApMaterno) AS NombreCompletoUsuario
                FROM Gasto G
                INNER JOIN Usuario U ON G.IdUsuario = U.IdUsuario
                WHERE U.CodigoAdmin = ?
            `;
                    params = [usuario[0].CodigoAdmin];
                }
                else {
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
                const gastos = yield database_1.default.query(query, params);
                res.json({ gastos });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al obtener los gastos' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idUser } = req.params;
            const gasto = req.body;
            gasto.IdUsuario = idUser;
            try {
                yield database_1.default.query('INSERT INTO Gasto SET ?', [gasto]);
                res.json({ message: 'Gasto guardado' });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al crear el gasto' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, idUser } = req.params;
            try {
                const usuario = yield database_1.default.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);
                if (usuario.length === 0) {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                    return;
                }
                const { Rol } = usuario[0];
                let result;
                if (Rol === 'superAdmin') {
                    result = yield database_1.default.query('DELETE FROM Gasto WHERE IdGasto = ?', [id]);
                }
                else if (Rol === 'admin') {
                    result = yield database_1.default.query('DELETE FROM Gasto WHERE IdGasto = ? AND EXISTS (SELECT 1 FROM Usuario WHERE IdUsuario = Gasto.IdUsuario AND CodigoAdmin = ?)', [id, usuario[0].CodigoAdmin]);
                }
                else {
                    result = yield database_1.default.query('DELETE FROM Gasto WHERE IdGasto = ? AND IdUsuario = ?', [id, idUser]);
                }
                if (result.affectedRows > 0) {
                    res.json({ message: 'Gasto eliminado' });
                }
                else {
                    res.status(404).json({ error: 'Gasto no encontrado o el usuario no tiene permisos' });
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al eliminar el gasto' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, idUser } = req.params;
            const gasto = req.body;
            try {
                const usuario = yield database_1.default.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);
                if (usuario.length === 0) {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                    return;
                }
                const { Rol } = usuario[0];
                let result;
                if (Rol === 'superAdmin') {
                    result = yield database_1.default.query('UPDATE Gasto SET ? WHERE IdGasto = ?', [gasto, id]);
                }
                else if (Rol === 'admin') {
                    result = yield database_1.default.query('UPDATE Gasto SET ? WHERE IdGasto = ? AND EXISTS (SELECT 1 FROM Usuario WHERE IdUsuario = Gasto.IdUsuario AND CodigoAdmin = ?)', [gasto, id, usuario[0].CodigoAdmin]);
                }
                else {
                    result = yield database_1.default.query('UPDATE Gasto SET ? WHERE IdGasto = ? AND IdUsuario = ?', [gasto, id, idUser]);
                }
                if (result.affectedRows > 0) {
                    res.json({ message: 'Gasto actualizado' });
                }
                else {
                    res.status(404).json({ error: 'Gasto no encontrado o el usuario no tiene permisos' });
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al actualizar el gasto' });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, idUser } = req.params;
            try {
                const usuario = yield database_1.default.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);
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
                }
                else if (Rol === 'admin') {
                    query = `
          SELECT * FROM Gasto WHERE IdGasto = ? AND EXISTS (
            SELECT 1 FROM Usuario WHERE IdUsuario = Gasto.IdUsuario AND CodigoAdmin = ?
          )
        `;
                    params = [id, CodigoAdmin];
                }
                else {
                    query = 'SELECT * FROM Gasto WHERE IdGasto = ? AND IdUsuario = ?';
                    params = [id, idUser];
                }
                const gasto = yield database_1.default.query(query, params);
                if (gasto.length > 0) {
                    gasto[0].FechaTransaccion = gasto[0].FechaTransaccion.toISOString().split('T')[0];
                    res.json(gasto[0]);
                }
                else {
                    res.status(404).json({ text: 'El gasto no existe o no tiene acceso' });
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al obtener el gasto' });
            }
        });
    }
}
exports.gastoController = new GastoController();
exports.default = exports.gastoController;
