
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
  const { limit = 20, page = 1 } = req.query;
  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);
  const offset = (parsedPage - 1) * parsedLimit;

  try {
   
    const totalCount = await prisma.message.count();

    if (totalCount === 0) {
      return res.json({
        messages: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 1
      });
    }
    const totalPages = Math.max(1, Math.ceil(totalCount / parsedLimit));
    
    const validatedPage = Math.min(Math.max(1, parsedPage), totalPages);

    const messages = await prisma.message.findMany({
      skip: (validatedPage - 1) * parsedLimit,
      take: parsedLimit,
      orderBy: { timestamp: 'desc' },
      include: {
        replies: {
          orderBy: {
            timestamp: 'asc'
          }
        }
      }
    });

    res.json({
      messages,
      totalCount,
      currentPage: validatedPage,
      totalPages
    });
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