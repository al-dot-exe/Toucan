function exampleServiceStart() {
   // Socket.io setup
   const socket = io("http://localhost:3131/");

   // Init feathers app
   const app = feathers();

   // Register socket.io to talk to server
   app.configure(feathers.socketio(socket));

   document.getElementById("form").addEventListener("submit", sendIdea);

   async function sendIdea(e) {
      e.preventDefault();

      const text = document.getElementById("idea-text");
      const tech = document.getElementById("idea-tech");
      const viewer = document.getElementById("idea-viewer");

      // Create new idea
      app.service("example").create({
         text: text.value,
         tech: tech.value,
         viewer: viewer.value,
      });

      // Clear inputs
      text.value = "";
      tech.value = "";
      viewer.value = "";
   }

   function renderIdea(idea) {
      document.getElementById(
         "ideas"
      ).innerHTML += `<div class="card bg-secondary my-3">
                 <div class="card-body">
                   <p class="lead">
                     ${idea.text} <strong>(${idea.tech})</strong>
                     <br />
                     <em>Submitted by ${idea.viewer}</em>
                     <br />
                     <small>${idea.time}</small>
                   </p>
                 </div>
               </div>`;
   }

   async function init() {
      // Find ideas
      const ideas = await app.service("example").find();

      // Add existing ideas to list
      ideas.forEach(renderIdea);

      // Add idea in realtime
      app.service("example").on("created", renderIdea);
   }

   init();
};

export { exampleServiceStart }
