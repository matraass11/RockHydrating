import torchvision
import torchvision.transforms as transforms
import torch
import torch.nn.functional as F
import torch.nn as nn
from torch.utils.data import DataLoader

class Net(nn.Module):

    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 64, 5, 1)
        self.conv2 = nn.Conv2d(64, 64, 3, 1)
        self.pool1 = nn.MaxPool2d(2)
        ins = int(((28 - 5 + 1 - 3 + 1) / 2)**2 * 64)
        self.drop1 = nn.Dropout(0.25)
        self.lin1 = nn.Linear(ins, 128)
        self.drop2 = nn.Dropout(0.5)
        self.lin2 = nn.Linear(128, 10)
        
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
    

train = torchvision.datasets.MNIST('digitclassifier/model', train=True)
test = torchvision.datasets.MNIST('digitclassifier/model', train=False)

# train.transform = transforms.ToTensor()
# minmaxed_train = torch.cat(tuple(train[k][0] for k in range(len(train)))) # transform only applies at __getitem()__, cumbersome stat calc
# mean, std = minmaxed_train.mean(), minmaxed_train.std()
mean, std = 0.1307, 0.3081 # calculated above

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=mean, std=std) # the mean and std of the downscaled dataset
])
train.transform = test.transform = transform

train_loader = DataLoader(train, batch_size=64, shuffle=True)
test_loader = DataLoader(test, batch_size=1024, shuffle=True)


def train(model, train_loader, device, optimiser):
    model.train()
    for batch_ix, (data, target) in enumerate(train_loader):
        data, target = data.to(device), target.to(device)
        logits = model(data)
        loss = F.cross_entropy(logits, target)
        
        model.zero_grad()
        loss.backward()
        optimiser.step()

def test(model, test_loader, device, epoch):
    loss, correct = 0, 0

    model.eval()
    with torch.no_grad():
        for batch_ix, (data, target) in enumerate(test_loader):
            data, target = data.to(device), target.to(device)
            logits = model(data)
            loss += F.cross_entropy(logits, target, reduction='sum')
            preds = logits.argmax(dim=1)
            correct += sum(preds==target)
            
    loss /= len(test_loader.dataset) # average loss over each example
    print(f'epoch {epoch}: average test loss: {loss:.3f}, accuracy: {correct/len(test_loader.dataset):.2f}, correct: {correct}/{len(test_loader.dataset)}')


device = torch.device('mps')
model = Net().to(device)
epochs = 10
optimiser = torch.optim.Adam(model.parameters(), lr=0.001, weight_decay=0.0001)

for epoch in range(epochs):
    train(model, train_loader, device, optimiser)
    test(model, test_loader, device, epoch)


save = True
if save:
    torch.save(model.state_dict(), 'digitclassifier/model/modelSaved')