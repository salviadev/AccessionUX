/// <reference types="@phoenix/phoenix-cli" />
namespace Tiers {
    const
        _p = Phoenix,
        _customData = _p.customData;

    class PreferencesController extends Phoenix.ui.FormController {
        public onModelChanged(action, model, form: Phoenix.ui.Form, modal) {
            super.onModelChanged(action, model, form, modal);
            switch (action.property) {
                case 'validate':
                    if (!model.validate()) return;
                    form.execAction('$links.savePreference');
                    break;
                case 'afterSavePreferences':
                    if (model.hasErrors()) {
                        modal.setButtonVisible('validate', false);
                        return;
                    }
                    form.broadcast('refresh-models', { model: model.codeModel });
                    modal.close();
                    break;

            }
        }

    }
    _customData.register('preferences-management.controller', new PreferencesController());

}