/// <reference types="@phoenix/phoenix-cli" />
/// <reference path="../../outils/controllers/spo-communication.ts" />
namespace Accession {
    let _p = Phoenix,
        _ui = _p.ui,
        _dom = _p.dom,
        _utils = _p.utils,
        _link = _p.link,
        _customData = _p.customData,
        _data = _p.data;
    export class DocsJoints extends Phoenix.ui.FormController {
        private static updateLookup(lookupSchema: any, fieldOptions: any, lookupInfo: string) {
            if (!lookupInfo) return;
            const lookupInfoObj = JSON.parse(lookupInfo);
            const props: any = {};
            fieldOptions.lookupColumns = [];
            if (lookupInfoObj.columns) {
                for (let i = 0; i < lookupInfoObj.columns.length; i++) {
                    const col = lookupInfoObj.columns[i];
                    props[col.field] = {
                        title: col.title,
                        type: 'string',
                    };
                    if (col.hidden) {
                        props[col.field].capabilities = '';
                        props[col.field].hidden = true;
                    } else {
                        fieldOptions.lookupColumns.push(col.field);
                    }
                }
            }
            lookupSchema.properties.documents.items.properties = props;
        }


        public static open(form, piece?: string, objet?: string, operation?: string, type?: string) {
            const params: any = {};
            if (piece) {
                params.piece = piece;
            }
            if (objet) {
                params.objet = objet;
            }
            if (type) {
                params.type = type;
            }
            if (operation) {
                params.operation = operation;
            }
            form.navigate('ged/documents', {
                canGoBack: true,
                checkForChanges: true,
                urlSearch: params
            });
        }
        public onModelChanged(action, model, form) {
            const that = this;
            if (action.operation === 'init') {
                model.documents.$links.new.isDisabled = model.objetFilter !== 'all' || model.objetFilter !== 'Operation' || model.pieceFilter ? false : true;
            }
            if (action.operation === 'init') {
                const lp = form.controlByName('lookupPiece', false);
                if (lp) {
                    if (lp.length && lp[0].$lookup && lp[0].$lookup.schema) {
                        DocsJoints.updateLookup(lp[0].$lookup.schema, lp[0].fieldOptions, model.lookupInfo);
                    }
                } 
            }
            switch (action.property) {
                case 'lookupInfo':
                    const ll = form.controlByName('lookupPiece', false);
                    if (ll && ll.length && ll[0].$lookup && ll[0].$lookup.schema) {
                        DocsJoints.updateLookup(ll[0].$lookup.schema, ll[0].fieldOptions, model.lookupInfo);
                    }
                    break;
                case 'pieceFilter':
                    model.documents.$links.new.isDisabled = model.objetFilter !== 'all' || model.objetFilter !== 'Operation' || model.pieceFilter ? false : true;
                    break;
                case 'documents.$links.download':
                    if (model.documents.$selected.linkFichierDoc) {
                        _dom.downloadUriHandler(_data.getUrlBaseByType('rest', true, false) + model.documents.$selected.linkFichierDoc);
                    }
                    break;
                case 'documents.$links.new':
                    this.upload(model.uploadDocUrl, null, null, null, form);
                    break;
                case 'documents.$links.update':
                    const code = model.documents.$selected.codeDoc;
                    const title = model.documents.$selected.libDoc;
                    const commentaire = model.documents.$selected.commentaireDoc;
                    this.edit(code, title, commentaire, form);
                    break;
                case "$links.back":
                    const ctx = _link.context();
                    if (ctx.$url.backToSpo) {
                        sendToSpo('go-back', null, form);
                    } else {
                        form.back(false);
                    }
                    break;
            }
        }
        private upload(uploadUrl: string, codeDoc: string, title: string, commentaire: string, form) {
            if (!uploadUrl) return;
            _utils.upload({
                infoMessage: '',
                formTitle: 'Rattacher un document',
                showUploadTitle: true,
                uploadTitle: true,
                title: 'Libellé',
                titleValue: title || '',
                showUploadNotes: true,
                notes: commentaire || '',
                url: _data.getUrlBaseByType('rest', true, false) + uploadUrl
            }, (data, mForm) => {
                form.execAction('documents.$links.uploadDoc', { data: { code: codeDoc, refFichier: data.code, libelle: mForm.$model.title, commentaire: mForm.$model.notes } })
            });

        }
        private edit(codeDoc: string, title: string, commentaire: string, form) {
            const layout = {
                name: "confirm",
                $type: "block",
                $items: [
                    {
                        $type: "block",
                        $items: [
                            { $bind: 'title' },
                            {
                                $bind: 'notes',
                                options: {
                                    titleIsHidden: true
                                }
                            }
                        ]
                    }
                ]
            };
            const opt = {
                title: 'Modifier un document',
                noClose: true,
                buttons: [{ pattern: 'validate' }, { pattern: 'abandon' }]
            };
            const ldata = {
                notes: commentaire,
                title: title
            };
            var schema = {
                type: "object",
                properties: {
                    title: {
                        title: 'Libellé',
                        type: "string"
                    },
                    notes: {
                        type: "string",
                        format: 'memo'
                    }
                }
            };
            _ui.OpenModalForm(opt, layout, schema, ldata, null, function (modal, action, model, formcontrol) {
                if (action.operation === "modal-action") {
                    switch (action.property) {
                        case "validate":
                            if (model.hasErrors())
                                return;
                            form.execAction('documents.$links.modifyDoc', { data: { code: codeDoc, libelle: model.title, commentaire: model.notes } });
                            modal.close();
                            break;
                    }
                }
            });
        }
    }
    _customData.register('accession.sync.ged.documents.controller', new DocsJoints());

}
