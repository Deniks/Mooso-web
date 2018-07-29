from django.shortcuts import render

def index(request):
    return render(request, 'main/Music.html')

def author(request):
    return render(request, 'main/Author.html', {
        'contacts': ['My name is Denis and i am owner of this website!', '16 years old']
    })