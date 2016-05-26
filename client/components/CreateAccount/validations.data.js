export default [
 { text: 'at least 6 characters', predicate: v => v.length > 5 },
 { text: 'at least 1 lowercase letter', predicate: v => v.match(/[a-z]/) },
 { text: 'at least 1 uppercase letter', predicate: v => v.match(/[A-Z]/) },
 { text: 'at least 1 special character (@#$%^&+*=)', predicate: v => v.match(/[@#$%^&+*=]/) }
];
