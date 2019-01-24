/* global describe beforeEach it */

const db = require('../index');
const User = db.model('user');

xdescribe('User model', () => {
  let user;
  const sequelizeErrors = [
    'SequelizeValidationError',
    'SequelizeUniqueConstraintError'
  ];

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
        expect(typeof user.salt()).to.be.equal('string');
      });

      it('should return true if the password is correct', async function() {
        await user.save();
        const valid = await user.validPassword('password');
        expect(valid).to.be.equal(true);
      });

      it('should return false if the password is incorrect', async function() {
        await user.save();
        const valid = await user.validPassword('bonez');
        expect(valid).to.be.equal(false);
      });

      it('should encrypt password', async function() {
        const unEncryptedPass = user.password;
        await user.save();
        expect(user.password()).not.to.be.equal(unEncryptedPass);
        user.password = 'newPassword';
        await user.save();
        expect(user.password()).not.to.be.equal('newPassword');
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
              expect(sequelizeErrors).to.contain(err.name);
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
          expect(sequelizeErrors).to.contain(err.name);
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
              expect(sequelizeErrors).to.contain(err.name);
            }
          })
        );
      });
      it('should capitilize names', async function() {
        user.firstName = 'valid';
        user.lastName = 'name';
        await user.save();

        expect(user.firstName).to.be.equal('Valid');
        expect(user.lastName).to.be.equal('Name');
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
              expect(sequelizeErrors).to.contain(err.name);
            }
          })
        );
      });
    }); // end describe('correctNames')
  }); // end describe('instanceMethods')
}); // end describe('User model'
