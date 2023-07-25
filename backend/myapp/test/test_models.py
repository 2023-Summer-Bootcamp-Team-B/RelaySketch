from django.test import TestCase
from myapp.models import Room, SubRoom, Topic
from django.utils import timezone


class RoomModelTest(TestCase):
    def test_room_creation(self):
        room = Room.objects.create()
        self.assertTrue(isinstance(room, Room))
        self.assertIsNone(room.delete_at)

    def test_room_deletion(self):
        room = Room.objects.create()
        room.delete()
        self.assertIsNotNone(room.delete_at)
        self.assertLessEqual(room.delete_at, timezone.now())


class SubRoomModelTest(TestCase):
    def setUp(self):
        self.room = Room.objects.create()

    def test_subroom_creation(self):
        subroom = SubRoom.objects.create(first_player='플레이어 1', room=self.room)
        self.assertTrue(isinstance(subroom, SubRoom))
        self.assertEqual(subroom.first_player, '플레이어 1')
        self.assertIsNone(subroom.delete_at)

    def test_subroom_deletion(self):
        subroom = SubRoom.objects.create(first_player='플레이어 1', room=self.room)
        subroom.delete_subroom()
        self.assertIsNotNone(subroom.delete_at)
        self.assertLessEqual(subroom.delete_at, timezone.now())


class TopicModelTest(TestCase):
    def setUp(self):
        self.room = Room.objects.create()
        self.subroom = SubRoom.objects.create(first_player='플레이어 1', room=self.room)

    def test_topic_creation(self):
        topic = Topic.objects.create(title='Test Topic', sub_room=self.subroom)
        self.assertTrue(isinstance(topic, Topic))
        self.assertEqual(topic.title, 'Test Topic')
        self.assertIsNone(topic.delete_at)

    def test_topic_deletion(self):
        topic = Topic.objects.create(title='Test Topic', sub_room=self.subroom)
        topic.delete()
        self.assertIsNotNone(topic.delete_at)
        self.assertLessEqual(topic.delete_at, timezone.now())
