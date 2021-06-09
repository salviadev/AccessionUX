/// <reference types="@phoenix/phoenix-cli" />
namespace Accession {
    const
        _p = Phoenix,
        _ulocale = _p.ulocale,
        _utils = _p.utils,
        _customData = _p.customData;

    
    class LocaleController extends Phoenix.ui.FormController {
        public static dataFactory(context: any): Promise<any> {
            const data: any  = {
                lang: _ulocale.currentLang,
                languages: []
            }
            const languages = _ulocale.languages();
            languages.forEach(lang => {
                data.languages.push({code: lang, title: lang});
            });
            return _utils.Promise.resolve(data);
        }
        public onModelChanged(action, model, form: Phoenix.ui.Form) {
            super.onModelChanged(action, model, form);
            switch (action.property) {
                case '$links.save':
                    _ulocale.changeLang(model.lang);
                    break;

            }
        }
    }

    _customData.register('language.data-factory', LocaleController.dataFactory);

    _customData.register('language.controller', new LocaleController());

}