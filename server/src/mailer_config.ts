import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true para el puerto 465, false para otros puertos
  auth: {
    user: "luismanuelr245@gmail.com",  // Correo Emisor
    pass: "koon kkua inwp avjc",   //Contraseña de aplicacion
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verifica el transporte
transporter
  .verify()
  .then(() => {
    console.log("Listo para envío de correos");
  })
  .catch((err: Error) => {
    // Corrección de tipo
    console.error("Error al verificar el transporte:", err);
  });
