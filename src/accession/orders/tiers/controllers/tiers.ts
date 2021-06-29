/// <reference types="@phoenix/phoenix-cli" />
namespace Accession {
    let _p = Phoenix,
        _ui = Phoenix.ui,
        _customData = _p.customData;
    export class TiersController extends Phoenix.ui.FormController {
        public onModelChanged(action, model, form) {
            const that = this;
            super.onModelChanged(action, model, form);
            switch (action.property) {
                case 'tiers.$links.add':
                    form.navigate('orders/tiers/tiers-detail', {
                        canGoBack: true,
                        checkForChanges: true,
                        urlSearch: {}
                    });
                    break;
                case 'tiers.$item.$links.modify':
                    _ui.showModalForm({
                        name: 'orders/tiers/forms/tiers-detail-modal', // form name 
                        meta: 'orders/tiers/metas/tiers-detail', // meta name
                        controller: 'phoenix.empty.controller', // controller
                        options: { noClose: true, title: form.t.tiers, buttons: [{ pattern: 'abandon', close: true }, { pattern: 'validate' }] } // modal title && buttons
                    }, { code: action.actionParams.code })
                    break;

            }
        }

    }
    _customData.register('accession.sync.tiers.controller', new TiersController());

}
