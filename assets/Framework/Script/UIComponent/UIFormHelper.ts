import { Asset, Node,assetManager,instantiate } from "cc";
import { UIGroup } from "./UIGroup";
import { UIForm } from "./UIForm";

export class UIFormHelper {
    public instantiateUIForm(uiFormAsset: object): object {
        let prefab = uiFormAsset as Asset;
        prefab.addRef();
        let ins = instantiate(prefab);
        return ins;
    }

    public createUIForm(uiFormInstance: object, uiGroup: UIGroup, userData: object): UIForm {
        let node = uiFormInstance as Node;
        if (!node) {
            console.error("createUIForm ，界面预制实例不存在");
            return null;
        }
        node.setParent(uiGroup.uiGroupHelper.node, false);
        return node.getOrAddComponent(UIForm);
    }

    public releaseUIForm(uiFormAsset: object, uiFormInstance: object) {
        let prefab = uiFormAsset as Asset;
        prefab.decRef();

        let node: Node = uiFormInstance as Node;
        node?.destroy();
    }
}