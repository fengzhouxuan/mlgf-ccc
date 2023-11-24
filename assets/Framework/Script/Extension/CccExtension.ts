import { Node,Component, Constructor } from "cc";

 Node.prototype.getOrAddComponent = function <T extends Component>(classConstructor: Constructor<T>): T {
    let component = this.getComponent(classConstructor);
    if (!component) {
        component = this.addComponent(classConstructor);
    }
    return component;
};

