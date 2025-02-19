export interface Usuario {
    IdUsuario?: string;
    Nombre?: string;
    ApPaterno?: string;
    ApMaterno?: string;
    NumTelefono?: string;
    Correo?: string;
    FechaNacimiento?: string;
    Usuario?: string;
    Contrasena: string;
    Rol: 'admin' | 'normal';
    CodigoAdmin?: string;
}
