import * as net from 'net';  // Asegúrate de importar correctamente el módulo 'net'

// Crear un servidor TCP
const server = net.createServer((socket: net.Socket) => {  // Especificamos el tipo del parámetro 'socket'
    console.log('Conexión establecida con:', socket.remoteAddress);

    // Manejar datos recibidos
    socket.on('data', (data: Buffer) => {
        const receivedData = data.toString();
        console.log('Datos recibidos:', receivedData);

        // Ejemplo simple de parseo
        const parts = receivedData.split(',');
        if (parts.length >= 9) {
            const imei = parts[0].split(':')[1];
            const lat = parts[6];
            const lon = parts[8];
            console.log(`IMEI: ${imei}, Latitud: ${lat}, Longitud: ${lon}`);
        } else {
            console.log('Formato de datos no reconocido');
        }
    });

    // Cuando el dispositivo cierra la conexión
    socket.on('end', () => {
        console.log('Conexión cerrada:', socket.remoteAddress);
    });

    // Manejar errores
    socket.on('error', (err: Error) => {
        console.error(`Error en la conexión: ${err.message}`);
    });
});

// Escuchar en el puerto 4000
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Servidor TCP escuchando en el puerto ${PORT}`);
});
