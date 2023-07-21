import re
from django.db import models
from django.utils import timezone


# Room 모델
class Room(models.Model):
    completeNum = models.IntegerField(default=0)
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

    # class Meta:
    #     # first_player 필드가 같은 room에 속한 SubRoom들끼리만 unique해야 함
    #     constraints = [
    #         models.UniqueConstraint(fields=['first_player', 'room'], name='unique_first_player_in_room')
    #     ]

    # SubRoom 객체가 delete 메서드를 호출할 때 호출되는 함수
    # 이 함수는 SubRoom 객체의 delete_at 필드를 현재 시간으로 설정하고 객체를 저장
    def delete(self, *args, **kwargs):
        self.delete_at = timezone.now()
        self.save()

    def get_next(self):
        return self.next_room
    @classmethod
    def get_first_subroom(cls, room):
        return cls.objects.filter(room=room, delete_at=None).order_by('created_at').first()

    @classmethod
    def get_last_subroom(cls, room):
        return cls.objects.filter(room=room, delete_at=None).order_by('-created_at').first()

    @classmethod
    def add_subroom(cls, room):
        first_subroom = cls.get_first_subroom(room)
        last_subroom = cls.get_last_subroom(room)

        # 이미 1개가 있다면
        if last_subroom:
            last_player_number = int(re.search(r'\d+', last_subroom.first_player).group())
            max_number = last_player_number + 1
        else:
            max_number = 1

        first_player = f'플레이어 {max_number}'

        subroom = SubRoom.objects.create(first_player=first_player, room=room)


        if last_subroom:
            last_subroom.next_room = subroom
            last_subroom.save()
            subroom.next_room = first_subroom
            subroom.save()
        else:
            subroom.next_room = subroom
            subroom.save()

        if max_number == 1 or not cls.objects.filter(room=room, is_host=True, delete_at=None).exists():
            subroom.is_host = True
            subroom.save()

        return subroom

    def delete_subroom(self):
        if self.is_host:
            next_subroom = SubRoom.objects.filter(room=self.room, is_host=False, delete_at=None).order_by(
                'created_at').first()

            if next_subroom:
                self.is_host = False
                next_subroom.is_host = True
                next_subroom.save()

        self.delete()


# Topic 모델
class Topic(models.Model):
    title = models.CharField(max_length=128)  # 제목
    url = models.CharField(max_length=512, null=True, blank=True)  # URL
    created_at = models.DateTimeField(auto_now_add=True)  # 생성 시간
    delete_at = models.DateTimeField(null=True, blank=True)  # 삭제 시간
    update_at = models.DateTimeField(auto_now=True)  # 최종 업데이트 시간
    sub_room = models.ForeignKey('SubRoom', on_delete=models.CASCADE)  # 해당 Topic 속한 SubRoom

    # Topic 객체가 delete 메서드를 호출할 때 호출되는 함수
    # 이 함수는 Topic 객체의 delete_at 필드를 현재 시간으로 설정하고 객체를 저장
    def delete(self, *args, **kwargs):
        self.delete_at = timezone.now()
        self.save()

    @classmethod
    def get_last_topic(cls, subroom):
        return cls.objects.filter(sub_room=subroom, delete_at=None).order_by('-created_at').first()
