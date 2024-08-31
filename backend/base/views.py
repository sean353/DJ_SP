from django.http import JsonResponse


def index(req):
    return JsonResponse('hello', safe=False)




