import express, { Request, Response } from 'express';
import bodyParser from 'body-parser'; // Importar body-parser

const app = express();
const PORT = 4000;

// Usar body-parser para JSON
app.use(bodyParser.json());

app.post('/', (req: Request, res: Response) => {
    console.log('Datos recibidos:', req.body); // Aquí puedes procesar los datos recibidos
    res.send('Datos recibidos'); // Respuesta al GPS
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
