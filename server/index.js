
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.get('/api/messages', async (req, res) => {
  const { limit = 10, offset = 0 } = req.query; 

  try {
    const messages = await prisma.message.findMany({
      skip: parseInt(offset),
      take: parseInt(limit),
      orderBy: { timestamp: 'desc' },
      include: {
        replies: {
          orderBy: {
            timestamp: 'asc'
          }
        }
      }
    });

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    const reply = await prisma.reply.create({
      data: {
        content,
        messageId: parseInt(id),
      },
    });
    
    res.json(reply);
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ error: 'Failed to create reply' });
  }
});


app.post('/api/messages', async (req, res) => {
  try {
    const { customerName, content } = req.body;
    const message = await prisma.message.create({
      data: {
        customerName,
        content,
      },
    });
    res.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});