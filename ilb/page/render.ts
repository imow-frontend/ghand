
import IPage from "./page";

export default function render(listPage:IPage){


    let filter = listPage.filter();
    let buttons = listPage.buttons();

    listPage.render;


    return render(buttons,filter,listPage.render)
}