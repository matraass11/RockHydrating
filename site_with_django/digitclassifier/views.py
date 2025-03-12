from django.shortcuts import render
from django.http import HttpResponse
from digitclassifier.model.infer import predict
import torch 

def none(request):
    return render(request, "digitclassifier/index.html", {"prediction": ''})

def display_prediction(request):
    hiddenData = request.POST.get('hiddenData')
    imgData = hiddenData.split(",")
    luminance = [float(imgData[i]) for i in range(3, len(imgData), 4)]
    data = torch.tensor(luminance).view(1, 1, 28, 28) # Batch x Color Channels x W x H

    minmaxed_data = (data - data.min())/(data.max() - data.min())
    mean, std = 0.1307, 0.3081
    standartized_data = (minmaxed_data - mean)/std

    prediction = predict(standartized_data)
    return render(request, "digitclassifier/index.html", {"prediction": prediction, "hiddenData": hiddenData})
