var assert  = require('assert');
var ht      = require('../index');

describe("Schemas", function() {

    var s = ht.validators;

    describe("Object validator", function() {

        var ceilingCat = { name : "Pixel", colour : "purple" };
        var basementCat = { name : "Penny" };
        var specialCat = { name : "Pixel", colour : "purple", lasers : true };
        var catOwner = { name : "Bea", cat : ceilingCat };

        it("should accept a strictly valid object", function() {
            var catSchema = s.Object({
                name : s.String(),
                colour : s.String()
            });
            assert.deepEqual(catSchema.validate(ceilingCat), ceilingCat);
        });

        it("should reject an invalid object", function() {
            var catSchema = s.Object({
                name : s.String(),
                colour : s.String()
            });
            assert.throws(function(){catSchema.validate(basementCat);}, Error);
        });

        it("should accept extra attributes with strict set false", function() {
            var catSchemaPermissive = s.Object({strict : false}, {
                name : s.String(),
                colour : s.String()
            });
            assert.deepEqual(catSchemaPermissive.validate(specialCat), specialCat);
        });

        it("should accept null if optional", function() {
            var catSchema = s.Object({opt : true}, {
                name : s.String(),
                colour : s.String()
            });
            assert.deepEqual(catSchema.validate(null), null);
        });

        it("should be composible", function() {

            var catSchema = s.Object({opt : true}, {
                name : s.String(),
                colour : s.String()
            });

            var ownerSchema = s.Object({
                name : s.String(),
                cat : catSchema
            });
            assert.deepEqual(ownerSchema.validate(catOwner), catOwner);
        });
    });

    describe("String validator", function() {
        var shortString = "Hi!";
        var longString = "I am the very model of a modern major general";
        var notAString = {};

        it("should accept a valid string", function() {
            var schema = s.String();
            assert.equal(schema.validate(shortString), shortString);
        });

        it("should reject an invalid string", function() {
            var schema = s.String();
            assert.throws(function(){schema.validate(notAString);}, Error);
        });

        it("should reject a string shorter than min", function() {
            var schema = s.String({min : 5});
            assert.throws(function(){schema.validate(shortString);}, Error);
        });

        it("should reject a string greater than max", function() {
            var schema = s.String({max : 3});
            assert.throws(function(){schema.validate(longString);}, Error);
        });

        it("should accept a valid enum", function() {
            var schema = s.String({enum : ["blue","green","red"]});
            assert.equal(schema.validate("blue"), "blue");
        });

        it("should reject an invalid enum", function() {
            var schema = s.String({enum : ["blue","green","red"]});
            assert.throws(function(){schema.validate("orange");}, Error);
        });

    });

    describe("Number validator", function() {
        var small = 2;
        var large = 900000000001;
        var stringNumber = "123";
        var notANumber = {};

        it("should accept a valid Number", function() {
            var schema = s.Number();
            assert.equal(schema.validate(small), small);
        });

        it("should reject an invalid Number", function() {
            var schema = s.Number();
            assert.throws(function(){schema.validate(notANumber);}, Error);
        });

        it("should accept a valid Number as a string", function() {
            var schema = s.Number();
            assert.equal(schema.validate(stringNumber), 123);
        });

        it("should reject a number less than min", function() {
            var schema = s.Number({min : 5});
            assert.throws(function(){schema.validate(small);}, Error);
        });

        it("should reject a number greater than max", function() {
            var schema = s.Number({max : 3});
            assert.throws(function(){schema.validate(longString);}, Error);
        });
    });

    describe("Boolean validator", function() {

        it("should accept a valid Bool", function() {
            var schema = s.Boolean();
            assert.equal(schema.validate(true), true);
        });
    });

    describe("Date validator", function() {
        var  old = new Date('1979');
        var  oldString = "1979";
        var  older = new Date('1970');
        var now = new Date();
        var notADate = {dinosaur : 'rawwwr'};

        it("should accept a valid Date", function() {
            var schema = s.Date();
            assert.equal(schema.validate(old).getTime(), old.getTime());
        });

        it("should reject an invalid Date", function() {
            var schema = s.Date();
            assert.throws(function(){schema.validate(notADate);}, Error);
        });

        it("should accept a valid Date as a string", function() {
            var schema = s.Date();
            assert.equal(schema.validate(oldString).getTime(), old.getTime());
        });

        it("should reject a Date less than min", function() {
            var schema = s.Date({min : old});
            assert.throws(function(){schema.validate(older);}, Error);
        });

        it("should reject a Date greater than max", function() {
            var schema = s.Date({max : old});
            assert.throws(function(){schema.validate(now);}, Error);
        });
    });

    describe("Array validator", function() {

        var numArray = [1,2,3];
        var mixedArray = [1,2,3,'bananna'];
        var messyArray = [1,2,3,'bananna', {name : 'cat', colour : 'brown'}];

        it("should accept a valid simple Array", function() {
            var schema = s.Array([s.Number()]);
            assert.deepEqual(schema.validate(numArray), numArray);
        });

        it("should reject an invalid simple Array", function() {
            var schema = s.Array([s.Number()]);
            assert.throws(function(){schema.validate(mixedArray)}, Error);

        });

        it("should accept a valid simple mixed Array", function() {
            var schema = s.Array([s.Number(), s.String()]);
            assert.deepEqual(schema.validate(mixedArray), mixedArray);
        });

        it("should accept a valid complex mixed Array", function() {
            var schema = s.Array([
                s.Number(),
                s.String(),
                s.Object({
                    name : s.String(),
                    colour : s.String()
                })
            ]);
            assert.deepEqual(schema.validate(messyArray), messyArray);
        });

    });

});
