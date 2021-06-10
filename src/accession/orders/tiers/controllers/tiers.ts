/// <reference types="@phoenix/phoenix-cli" />
namespace Accession {
    let _p = Phoenix,
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
                    form.navigate('orders/tiers/tiers-detail', {
                        canGoBack: true,
                        checkForChanges: true,
                        urlSearch: { code: action.actionParams.code }
                    });
                    break;

            }
        }

    }
    _customData.register('accession.sync.tiers.controller', new TiersController());

}
