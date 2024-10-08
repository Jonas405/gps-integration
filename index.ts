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

        // Expresión regular para extraer la información relevante
        const dataPattern = /lat:([+-]?\d*\.\d+)\s*lon:([+-]?\d*\.\d+)\s*Spd:(\d+)\s*T:(.*)\s*bat:(\d+)%\s*ID:(\d+)/;
        const match = receivedData.match(dataPattern);

        if (match) {
            const latitude = match[1];      // Latitud
            const longitude = match[2];     // Longitud
            const speed = match[3];         // Velocidad
            const timestamp = match[4];     // Fecha y hora
            const battery = match[5];       // Batería
            const imei = match[6];          // IMEI

            // Imprimir los detalles extraídos
            console.log('Detalles extraídos:');
            console.log(`  Latitud: ${latitude}`);
            console.log(`  Longitud: ${longitude}`);
            console.log(`  Velocidad: ${speed}`);
            console.log(`  Fecha y hora: ${timestamp}`);
            console.log(`  Batería: ${battery}%`);
            console.log(`  IMEI: ${imei}`);

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
