/// <reference types="@phoenix/phoenix-cli" />


namespace Accession {
    const _p = Phoenix,
        _link = _p.link,
        _dom = _p.dom;

    let cefSharpOk: boolean;
    if (window && (window as any).CefSharp) {
        (window as any).CefSharp.BindObjectAsync("dotNet", "dotNet")
            .then(() => {
                cefSharpOk = true;
            });
    }

    function _navigateToSpo(model: string, message: string, form: Phoenix.ui.Form, params?: any) {
    }
    export var sendToSpo = _navigateToSpo;
    export const inSPO = function() {
        return cefSharpOk;
    };

}

