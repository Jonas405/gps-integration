const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// Middleware para analizar el cuerpo de la solicitud
app.use(bodyParser.text({ type: '*/*' }));

app.post('/', (req: { body: any; }, res: { send: (arg0: string) => void; }) => {
    console.log('Datos recibidos:', req.body); // Aquí puedes procesar los datos
    res.send('Datos recibidos'); // Respuesta al GPS
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
