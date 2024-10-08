import * as net from 'net';

// Crear un servidor TCP
const server = net.createServer((socket: net.Socket) => {
    console.log('Conexión establecida con:', socket.remoteAddress);

    // Manejar datos recibidos
    socket.on('data', (data: Buffer) => {
        const receivedData = data.toString().trim(); // Convierte los datos a string y elimina espacios en blanco
        console.log('Datos recibidos (String):', receivedData);

        // Imprimir el buffer de datos
        console.log('Datos recibidos (Buffer):', data);

        // Expresión regular actualizada para incluir latitud/longitud decimales
        const dataPattern = /^\[SG\*(\d+)\*(\d+)\*(\w+),([+-]?\d*\.?\d+),([+-]?\d*\.?\d+)\]$/; 
        const match = receivedData.match(dataPattern);

        // Imprimir el patrón de datos
        console.log('Patrón de datos:', dataPattern);

        if (match) {
            const imei = match[1];          // IMEI
            const status = match[3];        // Estado
            const latitude = match[4];      // Latitud (decimal)
            const longitude = match[5];     // Longitud (decimal)

            // Imprimir los detalles extraídos
            console.log('Detalles extraídos:');
            console.log(`  IMEI: ${imei}`);
            console.log(`  Estado: ${status}`);
            console.log(`  Latitud: ${latitude}`);
            console.log(`  Longitud: ${longitude}`);

            // Aquí puedes agregar más lógica para procesar los datos como quieras

            // Enviar una respuesta al GPS si es necesario
            socket.write('Datos procesados correctamente\n'); // Respuesta opcional
        } else {
            console.log('Formato de datos no reconocido');
            // Enviar una respuesta de error al GPS si es necesario
            socket.write('Formato de datos no reconocido\n'); // Respuesta opcional
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
