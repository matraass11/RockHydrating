import torch
import torch.nn.functional as F
import torch.nn as nn

class Net(nn.Module):

    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 64, 5, 1)
        self.conv2 = nn.Conv2d(64, 64, 3, 1)
        self.pool1 = nn.MaxPool2d(2)
        ins = int(((28 - 5 + 1 - 3 + 1) / 2)**2 * 64)
        self.drop1 = nn.Dropout(0.5)
        self.lin1 = nn.Linear(ins, 128)
        self.drop2 = nn.Dropout(0.5)
        self.lin2 = nn.Linear(128, 10)
        self.print = False
        
    def forward(self, x):
        x = self.conv1(x)
        x = F.relu(x)
        x = self.conv2(x)
        x = F.relu(x)
        x = self.pool1(x)
        
        x = torch.flatten(x, start_dim=1) #only dim left is batchsize
    
        x = self.drop1(x)
        x = self.lin1(x)
        x = F.relu(x)
        x = self.drop2(x)
        x = self.lin2(x)
        return x
    

device = torch.device("mps")
model = Net().to(device)

model.load_state_dict(torch.load('digitclassifier/model/modelSaved', weights_only=True))
model.eval()

def predict(data):
    data = data.to(device)
    predictions = F.softmax(model(data), dim=1).argmax(dim=1).item()
    probs = [f'{x:.3f}' for x in F.softmax(model(data), dim=1).tolist()[0]]
    return predictions