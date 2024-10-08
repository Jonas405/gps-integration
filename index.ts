import * as net from 'net';

const server = net.createServer((socket) => {
    console.log('Conexión establecida con:', socket.remoteAddress);

    socket.on('data', (data) => {
        const receivedData = data.toString().trim();
        console.log('Datos recibidos (String):', receivedData);

        // Procesar el mensaje recibido
        // Puedes implementar lógica para extraer datos específicos aquí
    });

    socket.on('end', () => {
        console.log('Conexión cerrada:', socket.remoteAddress);
    });

    socket.on('error', (err) => {
        console.error(`Error en la conexión: ${err.message}`);
    });
});

const PORT = 5093; // Asegúrate de usar el puerto correcto
server.listen(PORT, () => {
    console.log(`Servidor TCP escuchando en el puerto ${PORT}`);
});
