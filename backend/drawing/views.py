from django.shortcuts import render


def index(request):
    s = 'ss'
    return render(request, "drawing/index.html")


def room(request, room_name):
    return render(request, "drawing/room.html", {"room_name": room_name})
