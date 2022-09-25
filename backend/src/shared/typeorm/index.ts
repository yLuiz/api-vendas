import { createConnection } from 'typeorm';

createConnection()

//docker run --name postgres -e POSTGRES_PASSWORD=DOCKER -p 5432:5432 -d postgres

/*

Onde tiver 'timestamp' colocar 'timestamp with time zone';


{
  name: 'created_at',
  type: 'timestamp with time zone',
  default: 'now()',
},
{
  name: 'updated_at',
  type: 'timestamp with time zone',
  default: 'now()',
},

*/