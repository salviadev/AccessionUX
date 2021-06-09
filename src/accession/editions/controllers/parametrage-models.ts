/// <reference types="@phoenix/phoenix-cli" />
namespace Accession {
    const
        _p = Phoenix,
        _locale = _p.locale,
        _ui = _p.ui,
        _customData = _p.customData,
        _dom = _p.dom,
        _link = _p.link,
        _utils = _p.utils,
        _data = _p.data;
    export class ParametrageEditionModels extends Phoenix.ui.FormController {
        public onModelChanged(action: any, model: any, form: Phoenix.ui.Form) {
            super.onModelChanged(action, model, form);
            const that = this;
            switch (action.property) {
                case 'modelsList.$links.new':
                    if (!model.uploadUrl) return;
                    _utils.upload({
                        infoMessage: '',
                        formTitle: 'Ajout d\'un modèle',
                        showUploadTitle: true,
                        uploadTitle: true,
                        title: 'Libellé',
                        showUploadNotes: false,
                        notes: 'Commentaire',
                        url: _data.getUrlBaseByType('rest', true, false) + model.uploadUrl
                    }, (data, mForm) => {
                        form.execAction('modelsList.$links.upload', { data: { code: data.code, title: mForm.$model.title } })
                    });
                    break;
                case 'modelsList.$links.update':
                    const code = model.modelsList.$selected.code;
                    const title = model.modelsList.$selected.libelle;
                    const defaultModel = model.modelsList.$selected.defaultModel;
                    this.edit(code, title, defaultModel, form);
                    break;
                case 'modelsList.$links.download':
                    if (model.modelsList.$selected.modelLink) {
                        _dom.downloadUriHandler(_data.getUrlBaseByType('rest', true, false) + model.modelsList.$selected.modelLink);
                    }
                    break
                case '$links.cancel':
                    this.goBack(form);
                    break;
            }
        }
        private goBack(form) {
            const ctx = _link.context();
            if (ctx && ctx.$url.backToSpo) {
                sendToSpo('go-back', null, form);
            } else {
                form.back(false);
            }
        }
        private edit(codeDoc: string, title: string, defaultModel: string, form) {
            const layout = {
                name: "confirm",
                $type: "block",
                $items: [
                    {
                        $type: "block",
                        $items: [
                            { $bind: 'title' },
                            {
                                $bind: 'defaultModel'
                            }
                        ]
                    }
                ]
            };
            const opt = {
                title: 'Modifier un modèle',
                noClose: true,
                buttons: [{ pattern: 'validate' }, { pattern: 'abandon' }]
            };
            const ldata = {
                defaultModel: defaultModel || false,
                title: title
            };
            var schema = {
                type: "object",
                properties: {
                    title: {
                        title: 'Libellé',
                        type: "string"
                    },
                    defaultModel: {
                        title: 'Par défaut',
                        type: "boolean"
                    }
                }
            };
            _ui.OpenModalForm(opt, layout, schema, ldata, null, function (modal, action, model, formcontrol) {
                if (action.operation === "modal-action") {
                    switch (action.property) {
                        case "validate":
                            if (model.hasErrors())
                                return;
                            form.execAction('modelsList.$links.modify', { data: { code: codeDoc, libelle: model.title, defaultModel: model.defaultModel } });
                            modal.close();
                            break;
                    }
                }
            });
        }
    }
    _customData.register('accession.sync.editions.parametrage-models.controller', new ParametrageEditionModels());
}