

function AppViewModel() {
    var self = this;
    self.modLED = {
        size: {
            x: ko.observable(6),
            y: ko.observable(4)
        },
        modules: ko.observableArray(['']),
        configType: ko.observable('simple'),
        subnetPrefix: ko.observableArray(['192', '168', '178']),
        simpleHosts: ko.observableArray([]),
        samePort: ko.observable(7890),
    }
    self.modLED.moduleNum = ko.computed(() => self.modLED.size.x() * self.modLED.size.y());

    self.save = () => {
        if(self.modLED.configType() == 'simple') {
            self.modLED.modules(self.modLED.simpleHosts().map((host) => `${self.modLED.subnetPrefix().join('.')}.${host}:${self.modLED.samePort()}`));
        }
        console.log(self.modLED.modules());
    }
}

ko.applyBindings(new AppViewModel());