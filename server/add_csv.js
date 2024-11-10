import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { parse } from 'csv-parse';
import { parse as parseDate } from 'date-fns';

const prisma = new PrismaClient();

async function importMessages() {
  const messages = [];

  const fileStream = fs.createReadStream('messages.csv');
  const parser = parse({
    columns: true,              
    delimiter: ',',             
    quote: '"',                 
    skip_empty_lines: true,     
    trim: true,                 
  });

 
  const processFile = new Promise((resolve, reject) => {
    fileStream
      .pipe(parser)
      .on('data', (row) => {
        try {
          const timestamp = row['Timestamp (UTC)']
            ? parseDate(row['Timestamp (UTC)'], 'yyyy-MM-dd HH:mm:ss', new Date())
            : new Date(); 
          messages.push({
            customerName: `User ${row['User ID']}`, 
            content: row['Message Body'],           
            timestamp: timestamp
          });
        } catch (error) {
          console.error('Error parsing row:', row, error);
        }
      })
      .on('end', () => resolve())
      .on('error', reject);
  });

  try {

    await processFile;

    
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];

      
      const existingMessage = await prisma.message.findFirst({
        where: {
          customerName: msg.customerName,
          content: msg.content,
          timestamp: msg.timestamp,  
        },
      });

      if (!existingMessage) {
        await prisma.message.create({
          data: {
            customerName: msg.customerName,
            content: msg.content,
            timestamp: msg.timestamp,
          },
        });
        console.log(`Imported message from ${msg.customerName}`);
      } else {
        console.log(`Duplicate message skipped from ${msg.customerName}`);
      }
    }

    console.log(`Successfully imported ${messages.length} messages.`);
  } catch (error) {
    console.error('Error importing messages:', error);
  } finally {
    await prisma.$disconnect();
  }
}


importMessages();
