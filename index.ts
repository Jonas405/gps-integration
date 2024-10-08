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

        // Patrón para mensajes UD (geolocalización) ajustado
        const udPattern = /^\[SG\*(\d+)\*\w{4}\*UD,(\d{6}),(\d{6}),([AV]),([\d.]+),(N|S),([\d.]+),(E|W),([\d.]+),(\d+),(\d+)(?:,(.+))*\]$/;

        // Intentar hacer match con cada patrón
        const lkMatch = receivedData.match(lkPattern);
        const udMatch = receivedData.match(udPattern);

        if (lkMatch) {
            // Si el mensaje es tipo LK (Keep Alive)
            const imei = lkMatch[1];          // IMEI
            const status = lkMatch[3];        // Estado
            const battery = lkMatch[4];       // Batería (porcentaje)

            console.log('Mensaje LK recibido:');
            console.log(`  IMEI: ${imei}`);
            console.log(`  Estado: ${status}`);
            console.log(`  Batería: ${battery}%`);

            // Enviar una respuesta opcional
            socket.write('Mensaje LK procesado\n');

            // Activar GPS en TK905 si se recibe un mensaje LK
            if (imei.startsWith('905')) { // Asumiendo que los IMEI del TK905 comienzan con 905
                const activateGPSCommand = 'AT+GPS=1\r\n'; // Comando para activar GPS
                socket.write(activateGPSCommand, (err) => {
                    if (err) {
                        console.error('Error al enviar el comando de activación GPS:', err);
                    } else {
                        console.log('Comando de activación GPS enviado al TK905.');
                    }
                });
            }
        } else if (udMatch) {
            // Si el mensaje es tipo UD (geolocalización)
            const imei = udMatch[1];          // IMEI
            const date = udMatch[2];          // Fecha en formato DDMMYY
            const time = udMatch[3];          // Hora en formato HHMMSS
            const positionStatus = udMatch[4]; // Estado de la posición (A o V)
            const latitude = parseFloat(udMatch[5]);  // Convertir a número
            const latDirection = udMatch[6];   // Dirección de la latitud (N o S)
            const longitude = parseFloat(udMatch[7]); // Convertir a número
            const longDirection = udMatch[8];  // Dirección de la longitud (E o W)
            const speed = udMatch[9];         // Velocidad en km/h
            const direction = udMatch[10];     // Dirección (grados)

            // Ajustar latitud y longitud según la dirección
            const adjustedLatitude = latDirection === 'S' ? -latitude : latitude;
            const adjustedLongitude = longDirection === 'W' ? -longitude : longitude;

            console.log('Mensaje UD recibido:');
            console.log(`  IMEI: ${imei}`);
            console.log(`  Fecha (UTC): ${date}`);
            console.log(`  Hora (UTC): ${time}`);
            console.log(`  Estado posición: ${positionStatus === 'A' ? 'Disponible' : 'Inválida'}`);
            console.log(`  Latitud: ${adjustedLatitude}`);
            console.log(`  Longitud: ${adjustedLongitude}`);
            console.log(`  Velocidad: ${speed} km/h`);
            console.log(`  Dirección: ${direction} grados`);

            // Enviar una respuesta opcional
            socket.write('Mensaje UD procesado\n');
        } else {
            // Si no coincide con ninguno de los patrones
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
