from django.shortcuts import render
import re
import base64

def index(request):
    return render(request, 'main/Music.html')

def author(request):
    return render(request, 'main/Author.html', {
        'contacts': ['My name is Denis and i am owner of this website!', '16 years old']
    })
def serverImg(request):
    dataUrlPattern = re.compile('data:image/(png|jpeg);base64,(.*)$')
    ImageData = request.POST.get('hidden_image_field')
    ImageData = dataUrlPattern.match(ImageData).group(2)

    # If none or len 0, means illegal image data
    if (ImageData == None or len(ImageData)) == 0:
        print('saved to a server')
        pass

    # Decode the 64 bit string into 32 bit
    ImageData = base64.b64decode(ImageData)
