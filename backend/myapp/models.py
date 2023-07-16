from django.db import models
from django.utils import timezone


# Room 모델
class Room(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)  # 생성 시간
    delete_at = models.DateTimeField(null=True, blank=True)  # 삭제 시간
    update_at = models.DateTimeField(auto_now=True)  # 최종 업데이트 시간

    # Room에서 delete 메서드를 호출할 때
    # Room 객체의 delete_at 필드를 현재 시간으로 설정하고 객체를 저장
    def delete(self, *args, **kwargs):
        self.delete_at = timezone.now()
        self.save()


# SubRoom 모델
class SubRoom(models.Model):
    first_player = models.CharField(max_length=32)  # 첫 플레이어
    created_at = models.DateTimeField(auto_now_add=True)  # 생성 시간
    delete_at = models.DateTimeField(null=True, blank=True)  # 삭제 시간
    update_at = models.DateTimeField(auto_now=True)  # 최종 업데이트 시간
    room = models.ForeignKey('Room', on_delete=models.CASCADE)  # 해당 Room
    is_host = models.BooleanField(default=False)  # 방장 여부
    # Room 속한 Room
    next_room = models.ForeignKey('self', null=True, on_delete=models.SET_NULL)  # 다음 SubRoom

    class Meta:
        # first_player 필드가 같은 room에 속한 SubRoom들끼리만 unique해야 함
        constraints = [
            models.UniqueConstraint(fields=['first_player', 'room'], name='unique_first_player_in_room')
        ]

    # SubRoom 객체가 delete 메서드를 호출할 때 호출되는 함수
    # 이 함수는 SubRoom 객체의 delete_at 필드를 현재 시간으로 설정하고 객체를 저장
    def delete(self, *args, **kwargs):
        self.delete_at = timezone.now()
        self.save()

    @classmethod
    def get_last_subroom(cls, room):
        last_subroom = cls.objects.filter(room=room).order_by('-created_at').first()
        if last_subroom is None or last_subroom.next_room == last_subroom:
            return last_subroom
        else:
            return cls.get_last_subroom(last_subroom.next_room)

    # SubRoom 객체를 추가하는 메서드
    # 이 메서드는 새로운 SubRoom을 추가하고, 이전 SubRoom의 next_room을 새로운 SubRoom으로 설정
    # SubRoom 객체를 추가하는 메서드
    # 이 메서드는 새로운 SubRoom을 추가하고, 이전 SubRoom의 next_room을 새로운 SubRoom으로 설정
    @classmethod
    def add_subroom(cls, room):
        max_number = cls.objects.filter(room=room, delete_at=None).count() + 1
        first_player = f'플레이어 {max_number}'

        subroom = SubRoom.objects.create(first_player=first_player, room=room)

        if max_number == 1 or not cls.objects.filter(room=room, is_host=True, delete_at=None).exists():
            subroom.is_host = True  # 첫 번째 서브룸이거나 현재 방장이 없는 경우 방장으로 설정합니다
            subroom.save()

        last_subroom = cls.get_last_subroom(room)
        if last_subroom:  # 이미 서브룸이 있으면
            last_subroom.next_room = subroom  # 이전 서브룸의 next_room을 새로운 서브룸으로 설정합니다
            last_subroom.save()  # 업데이트 후 last_subroom을 저장합니다
        else:  # 첫 서브룸이면
            subroom.next_room = subroom  # next_room을 자기 자신으로 설정합니다

        subroom.save()
        return subroom

    def delete_subroom(self):
        next_subroom = self.next_room

        # 방장이라면 다음 방에 방장을 넘기고 현재 방은 방장이 아니게 설정
        if self.is_host:
            while next_subroom != self and next_subroom.delete_at is not None:
                next_subroom = next_subroom.next_room

            if next_subroom != self:  # 새로운 방장이 자기 자신이 아니라면
                self.is_host = False  # 현재 방장의 is_host를 False로 설정
                next_subroom.is_host = True  # 다음 방을 방장으로 설정
                next_subroom.save()  # 변경 사항 저장

        self.delete_at = timezone.now()  # 방 삭제 시간을 현재로 설정
        self.save()  # 변경 사항 저장

        # 이전 방과 다음 방을 연결하고 현재 방을 삭제
        if self.next_room != self:
            previous_subroom = SubRoom.objects.get(room=self.room, next_room=self)
            previous_subroom.next_room = next_subroom
            previous_subroom.save()


# Topic 모델
class Topic(models.Model):
    title = models.CharField(max_length=128)  # 제목
    url = models.CharField(max_length=128, null=True, blank=True)  # URL
    created_at = models.DateTimeField(auto_now_add=True)  # 생성 시간
    delete_at = models.DateTimeField(null=True, blank=True)  # 삭제 시간
    update_at = models.DateTimeField(auto_now=True)  # 최종 업데이트 시간
    sub_room = models.ForeignKey('SubRoom', on_delete=models.CASCADE)  # 해당 Topic 속한 SubRoom

    # Topic 객체가 delete 메서드를 호출할 때 호출되는 함수
    # 이 함수는 Topic 객체의 delete_at 필드를 현재 시간으로 설정하고 객체를 저장
    def delete(self, *args, **kwargs):
        self.delete_at = timezone.now()
        self.save()
