import { Client, createClient } from 'edgedb';


declare global {
    var edgedb: Client | undefined
}

export const edgedb = global.edgedb || createClient()

if (process.env.NODE_ENV !== 'production') global.edgedb = edgedb
