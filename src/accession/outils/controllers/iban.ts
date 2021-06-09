/// <reference types="@phoenix/phoenix-cli" />
namespace Accession {
    const
        _p = Phoenix,
        _su = _p.Observable.SchemaUtils,
        _dom = _p.dom,
        _uiutils = _p.uiutils;
    const handlers: any = _su.handlers;
    handlers.format_iban = (value: string): string => {
        if (!value) return value;
        value = handlers.unformat_iban(value);
        return value.match(/.{1,4}/g).join(' ');
    };
    handlers.unformat_iban = (value: string): string => {
        if (!value) return value;
        return value.split(' ').join('');
    };
    const evtHandlers: any = _uiutils.utils;
    evtHandlers.input_iban = (event: InputEvent, input: HTMLInputElement, options: { schema: any }): boolean => {
        let nv: string = handlers.format_iban(input.value);
        if (nv) {
            nv = nv.toUpperCase();
            let start = input.selectionStart;
            let end = input.selectionEnd;
            if (end === input.value.length) {
                start = nv.length;
            } else if (start === input.value.length) {
                start = nv.length;
            } else if (nv.length > start) {
                if (nv[start] === ' ')
                    start++;
            }
            input.value = nv;
            end = start;
            _dom.selectRange(input, start);
        }
        return true;
    };

}