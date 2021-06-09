/// <reference types="@phoenix/phoenix-cli" />

namespace Accession {
    let _p = Phoenix,
        _customData = _p.customData,
        _ui = _p.ui;
    export class PaginatedListController extends Phoenix.ui.FormController {
        public onModelChanged(action, model, form: Phoenix.ui.Form) {
            super.onModelChanged(action, model, form);
            switch (action.property) {
                case 'refresh-models':
                    if (action.actionParams.model !== model.modelCode)
                        form.execAction('models.$links.refreshModels', { model: action.actionParams.model });
                    break;
                case 'models.$links.saveModel':
                    const modeleData = { classe: model.classePref, valeur: null, defaultModel: model.modelCode };
                    const grid = form.controlByName(model.listPropName + '-grid', false);
                    if (grid && grid.length) {
                        modeleData.valeur = JSON.stringify(grid[0].preferences());
                    }
                    _ui.showModalForm({
                        name: 'outils/forms/create-preference', // form name 
                        meta: 'outils/metas/create-preference', // meta name
                        controller: 'create-preference.controller', // controller
                        options: { title: form.t.saveModels, buttons: [{ pattern: 'abandon' }, { pattern: 'validate' }] } // modal title && buttons
                    }, modeleData)
                    break;
                case 'models.$links.manageModels':
                    _ui.showModalForm({
                        name: 'outils/forms/preferences', // form name 
                        meta: 'outils/metas/preferences', // meta name
                        controller: 'preferences-management.controller', // controller
                        options: { title: form.t.models, buttons: [{ pattern: 'abandon' }, { pattern: 'validate' }] } // modal title && buttons
                    }, { classe: model.classePref })
                    break;

            }
        }
        static displayLinkMontant(value: string, displayValue: string, line: any, options: any) {
            if (!line.parentArray || !value)
                return { noLink: true, html: false, value: displayValue };
            const html = [
                '<a href="#" class="bs-cursor-p" data-phoenix-href="link://$link">',
                displayValue,
                '</a>'
            ];
            return { noLink: true, html: true, value: html.join('') };
        }
    }
    _customData.register('ui.html.display-link-montant', PaginatedListController.displayLinkMontant);
}


