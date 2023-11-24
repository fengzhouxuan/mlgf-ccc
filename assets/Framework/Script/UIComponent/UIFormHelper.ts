import { Node, instantiate } from "cc";
import { UIGroup } from "./UIGroup";
import { UIForm } from "./UIForm";

export class UIFormHelper {
    public instantiateUIForm(uiFormAsset: object): object {
        return instantiate(uiFormAsset);
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
        let node: Node = uiFormInstance as Node;
        node?.destroy();
    }
}