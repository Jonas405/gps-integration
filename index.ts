import * as net from 'net';

// Crear un servidor TCP
const server = net.createServer((socket: net.Socket) => {
    console.log('Conexión establecida con:', socket.remoteAddress);

    // Manejar datos recibidos
    socket.on('data', (data: Buffer) => {
        console.log("data cruda buffer");
        console.log(data);
        const receivedData = data.toString().trim(); // Convierte los datos a string y elimina espacios en blanco
        console.log('Datos recibidos (String):', receivedData);
        console.log('Datos recibidos (Buffer):', data);

        // Patrón para mensajes LK
        const lkPattern = /^\[SG\*(\d+)\*(\d+)\*LK,(\d+),(\d+)\]$/;

        // Intentar hacer match con el patrón LK
        const lkMatch = receivedData.match(lkPattern);

        if (lkMatch) {
            // Si el mensaje es tipo LK (Keep Alive)
            const imei = lkMatch[1];          // IMEI
            const status = lkMatch[3];        // Estado
            const battery = lkMatch[4];       // Batería (porcentaje)

            console.log('Mensaje LK recibido:');
            console.log(`  IMEI: ${imei}`);
            console.log(`  Estado: ${status}`);
            console.log(`  Batería: ${battery}%`);

            // Enviar el comando de activación GPS
            const gpsCommand = `[SG*${imei}*0001*GPS]`; // Ajusta esto según el comando real
            console.log('Comando de activación GPS enviado al TK905:', gpsCommand);
            socket.write(gpsCommand + '\n'); // Asegúrate de agregar un salto de línea si es necesario

            // Enviar una respuesta opcional
            socket.write('Mensaje LK procesado\n');
        } else {
            console.log('Formato de datos no reconocido');
            socket.write('Formato de datos no reconocido\n');
        }
    });

    // Cuando el dispositivo cierra la conexión
    socket.on('end', () => {
        console.log('Conexión cerrada:', socket.remoteAddress);
    });

    // Manejar errores en la conexión
    socket.on('error', (err: Error) => {
        console.error(`Error en la conexión: ${err.message}`);
    });
});

// Escuchar en el puerto 4000
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Servidor TCP escuchando en el puerto ${PORT}`);
});
