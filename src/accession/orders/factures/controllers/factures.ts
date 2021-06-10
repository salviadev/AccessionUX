/// <reference types="@phoenix/phoenix-cli" />
namespace Accession {
    let _p = Phoenix,
        _customData = _p.customData;
    export class FacturesController extends Phoenix.ui.FormController {
        public onModelChanged(action, model, form) {
            const that = this;
            super.onModelChanged(action, model, form);
            switch (action.property) {
                case 'factures.$links.add':
                    form.navigate('orders/factures/facture-detail', {
                        canGoBack: true,
                        checkForChanges: true,
                        urlSearch: {}
                    });
                    break;
                case 'factures.$item.$links.modify':
                    form.navigate('orders/factures/facture-detail', {
                        canGoBack: true,
                        checkForChanges: true,
                        urlSearch: { code: action.actionParams.code }
                    });
                    break;

            }
        }

    }
    _customData.register('accession.sync.factures.controller', new FacturesController());

}
