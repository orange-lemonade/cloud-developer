import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, checkValidUrl} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get("/filteredimage", async(req, res, next) => {
    let { image_url } = req.query;

    if (!image_url || !checkValidUrl(image_url)) {
      res.status(400).send("Invalid Image URL");
    }

    const filtered = await filterImageFromURL(image_url);
    res.locals.filtered = filtered;
    res.on("finish", () => {
      deleteLocalFiles([decodeURI(res.locals.filtered)]);
    })
    res.status(200).sendFile(res.locals.filtered);
  });

  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();