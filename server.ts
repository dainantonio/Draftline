import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  // In-memory store for document data
  const documents: Record<string, any> = {};

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-document', (docId: string) => {
      socket.join(docId);
      console.log(`User ${socket.id} joined document ${docId}`);
      
      // Update and broadcast user count
      const room = io.sockets.adapter.rooms.get(docId);
      const userCount = room ? room.size : 0;
      io.to(docId).emit('user-count', userCount);
      
      // Send current state to the joining user
      if (documents[docId]) {
        socket.emit('document-update', documents[docId]);
      }
    });

    socket.on('edit-document', ({ docId, data }: { docId: string; data: any }) => {
      documents[docId] = data;
      // Broadcast to everyone else in the room
      socket.to(docId).emit('document-update', data);
    });

    socket.on('disconnecting', () => {
      // Notify rooms about user leaving
      socket.rooms.forEach(room => {
        const roomObj = io.sockets.adapter.rooms.get(room);
        if (roomObj) {
          io.to(room).emit('user-count', roomObj.size - 1);
        }
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Use regex for wildcard as per Express 5 guidelines
  server.all(/.*/, (req, res) => {
    return handle(req, res);
  });

  const PORT = 3000;
  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
