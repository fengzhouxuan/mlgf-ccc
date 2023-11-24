declare module 'cc' {
    interface Node {
        getOrAddComponent<T extends Component>(classConstructor: Constructor<T>): T;
    }
}


