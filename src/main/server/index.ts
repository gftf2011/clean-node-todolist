/**
 * Bootstrap must be the first import to load env values
 */
import '../bootstrap';
import { loader } from '../loaders';
import server from '../config/server';

loader()
  .then(async () => {
    (await server()).listen(Number(process.env.PORT), () => {
      console.log(`server running at port: ${Number(process.env.PORT)}`);
    });
  })
  .catch(error => {
    console.log(`error in running server error below:\n${error}`);
  });
