from django.shortcuts import render
from django.http import HttpResponse
from digitclassifier.model.infer import predict
import torch 

def none(request):
    return render(request, "digitclassifier/index.html", {"prediction": ''})

def display_prediction(request):
    hiddenData = request.POST.get('hiddenData'), request.POST.get('')
    imgData = hiddenData.split(",")
    luminance = [float(imgData[i]) for i in range(3, len(imgData), 4)]
    data = torch.tensor(luminance).view(1, 1, 28, 28) # Batch x Color Channels x W x H

    minmaxed_data = (data - data.min())/(data.max() - data.min())
    mean, std = 0.1307, 0.3081
    standartized_data = (minmaxed_data - mean)/std

    prediction, probs = predict(standartized_data)
    prediction = f"i think it's a {prediction}"
    probs = [f"{i}: {probs[i]} " if i%2 == 0 else f"{i}: {probs[i]}\n" for i in range(len(probs))]

    probs = ''.join(probs)
    
    return render(request, "digitclassifier/index.html", {"prediction": prediction, "probs": probs, "hiddenData": hiddenData})
