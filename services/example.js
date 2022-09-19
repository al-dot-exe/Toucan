const feathers = require('@feathersjs/feathers');                                 //Realtime framework
const socketio = require('@feathersjs/socketio');                                 //Realtime APIs with websockets
const moment = require('moment');
//
// Example service class
class ExampleService {
   constructor() {
      this.ideas = [];
   }

   async find() {
      return this.ideas;
   }

   async create(data){
      const idea = {
         id: this.ideas.length,
         text: data.text,
         tech: data.tech,
         viewer: data.viewer,
      }
      idea.time = moment().format('h:mm:ss a');

      this.ideas.push(idea);

      return idea;
   }
}

// app.service('ideas').create({
//    text: 'Build a cool app',
//    tech: 'Node js',
//    viewer: 'al.exe'
// })

service = new ExampleService;
module.exports = service;
