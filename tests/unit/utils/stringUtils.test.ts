import { emailValidator, replaceDashesWithUnderscrolls } from "../../../src/utils/stringUtils";

test('test email validator returns true for romeogweshe168@gmail.com', () => {
    
    const email = 'romeogweshe168@gmail.com';
    const actual = emailValidator(email);

    expect(actual).toEqual(true);
});

test('test email validator returns false for tadiwaemail.com', () => {
    
    const email = 'tadiwaemail.com';
    const actual = emailValidator(email);

    expect(actual).toEqual(false);
});

test('test email validator returns false for tadiwa@email', () => {
    
    const email = 'tadiwa@email';
    const actual = emailValidator(email);

    expect(actual).toEqual(false);
});

test('test email validator returns true for tadiwa@email.acme.com', () => {
    
    const email = 'tadiwa@email.acme.com';
    const actual = emailValidator(email);

    expect(actual).toEqual(true);
});

test('test email validator returns true for tadiwa@email.com with whitespace', () => {
    
    const email = 'tadiwa@email.com ';
    const actual = emailValidator(email);

    expect(actual).toEqual(true);
});

test('test replaceDasheWithUnderscrolls returns hello_world_yes- when given hello-world-yes-', () => {
    const word = 'hello-world-yes-';

    expect(replaceDashesWithUnderscrolls(word)).toStrictEqual('hello_world_yes_')
})