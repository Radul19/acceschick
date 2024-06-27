import express from 'express'
import routeGuest from './src/routes/guest.routes'
// import routeEvent from './src/routes/event.routes'
// import routeUser from './src/routes/user.routes'
//@ts-ignore
import cors from 'cors'
import path from 'path';
// import './db'
const app = express()

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cors({
    origin: "*",
}));
app.use(express.static(path.join(__dirname, 'src/app')));
// app.set('views',path.join(__dirname,'./src/app'))
// app.set('view engine', 'ejs');


app.use(routeGuest)
// app.use(routeEvent)
// app.use(routeUser)
const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server listen on port', port))