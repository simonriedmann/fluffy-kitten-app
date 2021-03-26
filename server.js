import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const connectionString = 'mongodb+srv://garfiled:test1234@cluster0.qdwtp.mongodb.net/fluffy-kitten?retryWrites=true&w=majority';

mongoose.connect(connectionString)

const server = express();

server.use(bodyParser.json());

const kittySchema = {
    name: String, fur: String, lives: Number
}


const Cat = mongoose.model('KittyCat', kittySchema)
//'KittyCat ist wie Schlüssel

server.get('/', (request, response) => {
    response.json({ status: 'Server is up and running.' })
});

//test ob server

server.get('/cats', (request, response) => {
    Cat.find().then((cats) => response.json(cats))
})

server.get('/cats/:catId', (request, response) => {
    const catId = request.params.catId;
    Cat.findById(catId).then(cat => response.json(cat))
})

server.post('/cats', (request, response) => {
    const kitty = new Cat({
        name: request.body.name,
        fur: request.body.fur,
        lives: request.body.lives
    })
    kitty.save().then(kitty => response.json(`${kitty.name} says meow.`)).catch((error) => response.json(error))
    })

  server.put('/cats/:catId', (request, response) => {
        const catId = request.params.catId;
        const updatedCat = request.body;

        Cat.findOneAndUpdate({ _id: catId }, updatedCat, {
            new: true,}).then((result) => response.json(result))
    });


    server.delete('/cats/:catId', (request, response) => {
        const catId = request.params.catId;
        const updatedCat = request.body;

        Cat.findOneAndDelete({ _id: catId },).then((result) => response.json(result))
    });

server.listen(4000);