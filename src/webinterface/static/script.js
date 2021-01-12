
class ModuleModel {

    constructor(appViewModel) {
        this.lastOctet = ko.observable();
        this.manualHost = ko.observable();

        this.config = appViewModel.modLED;
        this.host = ko.computed(() => {
            if (this.config.configType() == 'simple') {
                if (this.lastOctet() == null)
                    return null;
                return `${this.config.ipOctet1()}.${this.config.ipOctet2()}.${this.config.ipOctet3()}.${this.lastOctet()}:${this.config.samePort()}`;
            } else {
                return this.manualHost();
            }
        });
    }
}

class AppViewModel {
    constructor() {
        this.selectedSizeX = ko.observable(6);
        this.selectedSizeY = ko.observable(4);

        this.modLED = {
            size: {
                x: ko.observable(this.selectedSizeX()),
                y: ko.observable(this.selectedSizeY())
            },
            modules: ko.observable([]),
            configType: ko.observable('simple'),
            ipOctet1: ko.observable('192'),
            ipOctet2: ko.observable('168'),
            ipOctet3: ko.observable('178'),
            samePort: ko.observable(7890)
        };
        this.setSize();
    }

    onSizeChangedClick() {
        if (confirm('Are you sure? This will DELETE previously entered data in removed fields!')) {
            this.modLED.size.x(this.selectedSizeX());
            this.modLED.size.y(this.selectedSizeY());
            this.setSize();
        }
    }

    setSize() {
        let rows = [];
        for (let y = 0; y < this.modLED.size.y(); y++) {
            let column = [];
            for (let x = 0; x < this.modLED.size.x(); x++) {
                // keep data from before if possible
                if(this.modLED.modules()[y] && this.modLED.modules()[y][x]) {
                    column.push(this.modLED.modules()[y][x]);
                }
                else {
                    column.push(new ModuleModel(this));
                }
            }
            rows.push(column);
        }

        this.modLED.modules(rows);
    }

    save() {
        // generate manual config from simple config on save
        if (this.modLED.configType() == 'simple') {
            this.modLED.modules().forEach(row => {
                row.forEach(module => {
                    module.manualHost(module.host());
                })
            });
        }

        // actual save function
        console.log(this.modLED.modules().map(row => row.map(x => x.host())));
    }
}

ko.applyBindings(new AppViewModel());