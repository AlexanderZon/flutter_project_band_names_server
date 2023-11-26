const { io } = require('../index')
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();
bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Guns n Roses'));
bands.addBand(new Band('Metallica'));

// Mensajes de sockets
io.on("connection", (client) => {
  console.log("Cliente Conectado");

  client.emit('active-bands', bands.getBands());
  
  client.on('vote-band', (payload) => {
    console.log('vote-band: ', payload)
    if(typeof payload.id !== 'undefined') {
      bands.voteBand(payload.id)
      io.emit('active-bands', bands.getBands())
    }
  })
  client.on('add-band', (payload) => {
    console.log("add-band: ", payload);
    if(typeof payload.name !== 'undefined') {
      bands.addBand(new Band(payload.name))
      io.emit('active-bands', bands.getBands())
    }
  })
  client.on('delete-band', (payload) => {
    console.log("delete-band: ", payload);
    if(typeof payload.id !== 'undefined') {
      bands.deleteBand(payload.id)
      io.emit('active-bands', bands.getBands())
    }
  })

  client.on("disconnect", () => {
    console.log("Cliente Desconectado");
  });

  client.on("mensaje", (payload) => {
    console.log("Mensaje", payload);
    io.emit("mensaje", { admin: "Nuevo mensaje" });
  });

  client.on("emitir-mensaje", (payload) => {
    console.log("Mensaje", payload);
    // io.emit('nuevo-mensaje', payload); // Emitir a Todos
    client.broadcast.emit('nuevo-mensaje', payload); // Emitir a Todos

  })
});
