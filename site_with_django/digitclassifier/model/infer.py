import torch
import torch.nn.functional as F
from digitclassifier.model.model import Net, device

model = Net().to(device)

model.load_state_dict(torch.load('digitclassifier/model/modelSaved', weights_only=True))
model.eval()

def predict(data):
    data = data.to(device)
    predictions = F.softmax(model(data), dim=1).argmax(dim=1).item()
    probs = [f'{x:.2f}' for x in F.softmax(model(data), dim=1).tolist()[0]]
    return [predictions, probs]