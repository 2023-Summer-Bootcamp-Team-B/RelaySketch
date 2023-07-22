from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("myapp.routing")),
    re_path(r"static/(?P<path>.*)$", serve, {"document_root": settings.STATIC_ROOT}, name="static"),
    path('', include('django_prometheus.urls'))
]
