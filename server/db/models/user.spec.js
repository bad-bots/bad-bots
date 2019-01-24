/* global describe beforeEach it */

const db = require('../index');
const User = db.model('user');

describe('User model', () => {
  let user;
  const sequelizeErrors = [
    'SequelizeValidationError',
    'SequelizeUniqueConstraintError'
  ];

  afterAll(() => db.close());

  beforeEach(() => {
    return db.sync({ force: true });
  });

  beforeEach(() => {
    user = new User({
      email: 'valid@email.com',
      password: 'password',
      firstName: 'Valid',
      lastName: 'Name'
    });
  });

  describe('instanceMethods', () => {
    describe('correctPassword', () => {
      it('should auto generate salt', async function() {
        await user.save();
        expect(typeof user.salt()).toBe('string');
      });

      it('should return true if the password is correct', async function() {
        await user.save();
        const valid = await user.validPassword('password');
        expect(valid).toBe(true);
      });

      it('should return false if the password is incorrect', async function() {
        await user.save();
        const valid = await user.validPassword('bonez');
        expect(valid).toBe(false);
      });

      it('should encrypt password', async function() {
        const unEncryptedPass = user.password;
        await user.save();
        expect(user.password()).not.toBe(unEncryptedPass);
        user.password = 'newPassword';
        await user.save();
        expect(user.password()).not.toBe('newPassword');
      });
    }); // end describe('correctPassword')
    describe('correctEmail', () => {
      it('should not save invalid emails', function() {
        const invalidEmails = ['', null, undefined, 23234, 'astring'];

        return Promise.all(
          invalidEmails.map(async function(email) {
            user.email = email;
            try {
              await user.validate();
              throw new Error(`should not save invalid email: ${email}`);
            } catch (err) {
              expect(sequelizeErrors).toContain(err.name);
            }
          })
        );
      });
      it('should reject creating user if email exists', async function() {
        try {
          await user.save();
          await User.create({
            email: 'valid@email.com',
            password: 'password',
            firstName: 'Invalid',
            lastName: 'Name'
          });
          throw new Error('should not save user with existing email');
        } catch (err) {
          expect(sequelizeErrors).toContain(err.name);
        }
      });
    }); // end describe('correctEmail')
    describe('correctNames', () => {
      it('should not save invalid first name', function() {
        const invalidNames = [null, undefined, ''];
        return Promise.all(
          invalidNames.map(async name => {
            user.firstName = name;
            try {
              await user.validate();
              throw new Error(
                `should not save user with invalid name: ${name}`
              );
            } catch (err) {
              expect(sequelizeErrors).toContain(err.name);
            }
          })
        );
      });
      it('should capitilize names', async function() {
        user.firstName = 'valid';
        user.lastName = 'name';
        await user.save();

        expect(user.firstName).toBe('Valid');
        expect(user.lastName).toBe('Name');
      });
      it('should not save invalid last name', function() {
        const invalidNames = [null, undefined, ''];

        return Promise.all(
          invalidNames.map(async name => {
            user.lastName = name;
            try {
              await user.validate();
              throw new Error(
                `should not save user with invalid name: ${name}`
              );
            } catch (err) {
              expect(sequelizeErrors).toContain(err.name);
            }
          })
        );
      });
    }); // end describe('correctNames')
  }); // end describe('instanceMethods')
}); // end describe('User model'
