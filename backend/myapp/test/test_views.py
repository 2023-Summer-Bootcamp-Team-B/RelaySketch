from django.test import TestCase, Client
from django.urls import reverse
from myapp.models import Room


class TestViews(TestCase):

    def setUp(self):
        self.client = Client()
        self.add_room_url = reverse('add_room')  # 'add_room'는 URL 패턴의 이름입니다. 실제 프로젝트에 맞게 수정하세요.

    def test_add_room_POST(self):
        response = self.client.post(self.add_room_url)

        # 상태 코드가 200인지 확인
        self.assertEqual(response.status_code, 200)

        # 응답 메시지가 "방 생성 완료!"인지 확인
        self.assertContains(response, '방 생성 완료!')

        # Room 객체가 하나 생성되었는지 확인
        self.assertEqual(Room.objects.count(), 1)
