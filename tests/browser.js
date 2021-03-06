var expect = require('chai').expect;
var should = require('chai').should();
var path = require("path");
var html = path.join(__dirname,'../examples/index.html');
var jsdom = require("jsdom");

// this is an example of testing the component in the "browser"
describe('boilerplateRedux browser tests', function() {
    this.timeout(15000);
    // outline our tests
    var foo = false, // just a test var to make sure jsdom callback works
        size, // var to determine if options can be set in config object
        color, // var to determine if options can be set in config object
        initialState, // var to determine if intial state is set by options
        grow10Div, // var to determine if component GROW Action affects DOM
        grow10State, // var to determine if component GROW Action affects State
        grow50State, // var to determine if component GROW Action (with params) works
        resetState, // var to determine if component RESET Action works
        greenState, // var to determine if component COLOR Action works
        mountsDOM; // var to determine if component mounts on DOM

    beforeEach(function(done){

        jsdom.env({
          file: html,
          features: {
                FetchExternalResources: ["script"],
                ProcessExternalResources: ["script"],
                SkipExternalResources: false,
                MutationEvents           : '2.0'
            },
          done: function (err, window) {
            var $ = window.$;

            var boilerplateRedux = new window.IIIFComponents.ComponentBoilerplateRedux({
                    element: "#boilerplate-redux",
                    color: "blue",
                    size: 100
                });

            foo = true;
            size = boilerplateRedux.options.size;
            color = boilerplateRedux.options.color;
            initialState = boilerplateRedux.getState();

            mountsDOM = $( "#boilerplate-redux > div" ).length;

            $( "#grow10" ).trigger( "click" );
            grow10State = boilerplateRedux.getState();
            grow10Div = $( "#boilerplate-redux > div" ).width();
            $( "#grow50" ).trigger( "click" );
            grow50State = boilerplateRedux.getState();
            $( "#reset" ).trigger( "click" );
            resetState = boilerplateRedux.getState();

            // doesn't trigger the change event
            $( "#green" ).prop( "checked", true );
            // ^^ why not?
            greenState = boilerplateRedux.getState();

            done();
          }
        });

    });

    /*//////////
    // tests
    *///////////

    it('mounts on DOM element', function() {
        expect(mountsDOM).to.equal(1);
    });

    it('has a size option of 100', function() {
        expect(size).to.equal(100);
    });

    it('has a color option of blue', function() {
        expect(color).to.equal("blue");
    });

    it('has an initial state determined by options', function() {
        expect(initialState.color).to.equal("blue");
        expect(initialState.count).to.equal(100);
    });

    it('count increases by 10 when GROW Action is dispatched with a param of 10', function() {
        expect(grow10State.count).to.equal(110);
        expect(grow10Div).to.equal(210); // this.options.size + state.count
    });

    it('count increases by 50 when GROW Action is dispatched with a param of 50', function() {
        expect(grow50State.count).to.equal(160);
    });

    it('count resets when RESET Action is dispatched', function() {
        expect(resetState.count).to.equal(0);
    });

    it('foo should be true', function() {
        expect(foo).to.be.true; // <-- passes
    });

});
