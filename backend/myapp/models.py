from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator


# Room 모델
class Room(models.Model):
    player_num = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(6)])  # 플레이어 수
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
    first_player = models.CharField(max_length=32, default='플레이어 1')  # 첫 플레이어
    created_at = models.DateTimeField(auto_now_add=True)  # 생성 시간
    delete_at = models.DateTimeField(null=True, blank=True)  # 삭제 시간
    update_at = models.DateTimeField(auto_now=True)  # 최종 업데이트 시간
    room = models.ForeignKey('Room', on_delete=models.CASCADE)  # 해당 Sub
    # Room 속한 Room
    next_room = models.ForeignKey('self', null=True, on_delete=models.SET_NULL)  # 다음 SubRoom

    # SubRoom 객체가 delete 메서드를 호출할 때 호출되는 함수
    # 이 함수는 SubRoom 객체의 delete_at 필드를 현재 시간으로 설정하고 객체를 저장
    def delete(self, *args, **kwargs):
        self.delete_at = timezone.now()
        self.save()

    # SubRoom 객체를 추가하는 메서드
    # 이 메서드는 첫 번째 SubRoom을 찾아 새로운 SubRoom을 추가하고, 원래의 첫 번째 SubRoom을 새로운 SubRoom의 다음 SubRoom으로 설정
    def add_subroom(self, first_player):
        if not SubRoom.objects.filter(room=self).exists():  # 리스트가 비어있는 경우
            subroom = SubRoom.objects.create(first_player=first_player, room=self)
            subroom.next_room = subroom  # next_room을 자기 자신으로 설정
            subroom.save()
        else:  # 리스트에 이미 SubRoom 객체가 있는 경우
            first_subroom = SubRoom.objects.get(room=self, next_room__isnull=False)
            last_subroom = first_subroom.next_room
            subroom = SubRoom.objects.create(first_player=first_player, room=self, next_room=first_subroom)
            last_subroom.next_room = subroom
            last_subroom.save()

    # SubRoom 객체를 삭제하는 메서드
    # 이 메서드는 SubRoom 객체가 삭제되는 경우 다음 SubRoom 찾아 이전 SubRoom next_room으로 설정
    def delete_subroom(self):
        if self.next_room == self:  # 리스트에 하나의 SubRoom 객체만 있는 경우
            self.delete()
        else:  # 리스트에 여러 SubRoom 객체가 있는 경우
            previous_subroom = SubRoom.objects.get(room=self.room, next_room=self)
            next_subroom = self.next_room
            previous_subroom.next_room = next_subroom
            previous_subroom.save()
            self.delete()


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
