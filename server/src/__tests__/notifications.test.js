require('./setup');
const request = require('supertest');
const { app } = require('../index');
const Notification = require('../models/Notification');

describe('Notification Endpoints', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    token = res.body.data.accessToken;
    userId = res.body.data.user._id;
  });

  describe('GET /api/notifications', () => {
    it('should return empty notifications list', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.notifications).toHaveLength(0);
    });

    it('should return user notifications', async () => {
      await Notification.create({
        recipient: userId,
        title: 'Test notification',
        message: 'This is a test',
        type: 'info',
      });

      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.notifications).toHaveLength(1);
      expect(res.body.data.notifications[0].title).toBe('Test notification');
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/notifications');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/notifications/unread-count', () => {
    it('should return unread count', async () => {
      await Notification.create([
        { recipient: userId, title: 'Notif 1', message: 'Test', read: false },
        { recipient: userId, title: 'Notif 2', message: 'Test', read: true },
        { recipient: userId, title: 'Notif 3', message: 'Test', read: false },
      ]);

      const res = await request(app)
        .get('/api/notifications/unread-count')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.count).toBe(2);
    });
  });

  describe('PATCH /api/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      const notif = await Notification.create({
        recipient: userId,
        title: 'Unread notif',
        message: 'Test',
      });

      const res = await request(app)
        .patch(`/api/notifications/${notif._id}/read`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.read).toBe(true);
    });
  });

  describe('PATCH /api/notifications/read-all', () => {
    it('should mark all as read', async () => {
      await Notification.create([
        { recipient: userId, title: 'N1', message: 'T' },
        { recipient: userId, title: 'N2', message: 'T' },
      ]);

      const res = await request(app)
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);

      const unread = await Notification.countDocuments({ recipient: userId, read: false });
      expect(unread).toBe(0);
    });
  });

  describe('DELETE /api/notifications/:id', () => {
    it('should delete a notification', async () => {
      const notif = await Notification.create({
        recipient: userId,
        title: 'Delete me',
        message: 'Test',
      });

      const res = await request(app)
        .delete(`/api/notifications/${notif._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);

      const found = await Notification.findById(notif._id);
      expect(found).toBeNull();
    });
  });
});
