import mongoose from 'mongoose';
const { Schema } = mongoose;
import { connectionString } from "../password/credentials.js"
// For security, connectionString should be in a separate file and excluded from git


mongoose.connect(connectionString, {
    dbName: 'SSCPROJECT',
});

mongoose.connection.on('open', () => {
  console.log('Mongoose connected.');
});

// define data model as JSON key/value pairs
// values indicate the data type of each key
const bookSchema = new Schema({
 title: { type: String, required: true },
 author: { type: String, required: true },
 publicationdate: { type: Date, required: true },
 inStore: Boolean
});

export const Book = mongoose.model('Book', bookSchema);